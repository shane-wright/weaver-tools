use serde_json::json;
use serde::Serialize;
use reqwest;
use std::path::Path;
use tokio::fs;
use std::process::Command;
use tauri::State;

////////
// AI
////////

// Define the application state to hold the shared reqwest client
struct AppState {
    client: reqwest::Client,
}

#[derive(Serialize)]
struct ProjectInfo {
    files: Vec<String>,
    directories: Vec<String>,
}

// @function chat
// @description Chat function using the shared client from state
#[tauri::command]
async fn chat(
    model: String,
    messages: Vec<serde_json::Value>,
    session_id: String,
    state: State<'_, AppState>,
) -> Result<String, String> {
    let response = state.client
        .post("http://localhost:11434/api/chat")
        .json(&json!({
            "model": model,
            "messages": messages,
            "session_id": session_id,
            "stream": false
        }))
        .send()
        .await
        .map_err(|e| e.to_string())?;

    response.text().await.map_err(|e| e.to_string())
}

// @function get_local_models
// @description Get local models using the shared client from state
#[tauri::command]
async fn get_local_models(state: State<'_, AppState>) -> Result<Vec<serde_json::Value>, String> {
    let response = state.client
        .get("http://localhost:11434/api/tags")
        .send()
        .await
        .map_err(|e| e.to_string())?;

    let data: serde_json::Value = response.json().await.map_err(|e| e.to_string())?;

    let models = data["models"]
        .as_array()
        .unwrap_or(&vec![])
        .iter()
        .map(|model| {
            let name = model["name"].as_str().unwrap_or("").to_string();
            let description = name.split(':').next().unwrap_or("").replace('-', " ");
            json!({"name": name, "description": description})
        })
        .collect();

    Ok(models)
}

// @function get_project_info
#[tauri::command]
async fn get_project_info(project_path: String) -> Result<ProjectInfo, String> {
    let mut files = Vec::new();
    let mut directories = Vec::new();
    let mut dir = tokio::fs::read_dir(&project_path).await.map_err(|e| e.to_string())?;

    while let Some(entry) = dir.next_entry().await.map_err(|e| e.to_string())? {
        let path = entry.path();
        if path.is_file() {
            if let Some(file_name) = path.file_name().and_then(|s| s.to_str()) {
                files.push(file_name.to_string());
            }
        } else if path.is_dir() {
            if let Some(dir_name) = path.file_name().and_then(|s| s.to_str()) {
                directories.push(dir_name.to_string());
            }
        }
    }

    files.sort();
    directories.sort();
    Ok(ProjectInfo { files, directories })
}

// @function read_file
// @description Read file (unchanged, already optimal with tokio::fs)
#[tauri::command]
async fn read_file(file_path: String) -> Result<String, String> {
    fs::read_to_string(file_path).await.map_err(|e| e.to_string())
}

// @function save_file
// @description Save file (unchanged, already optimal with tokio::fs)
#[tauri::command]
async fn save_file(file_path: String, data: String) -> Result<(), String> {
    fs::write(file_path, data).await.map_err(|e| e.to_string())
}

// @function export_markdown
#[tauri::command]
async fn export_markdown(project_path: String) -> Result<String, String> {
    let project_path = Path::new(&project_path);
    if !project_path.is_dir() {
        return Err("Project path is not a directory".to_string());
    }

    let output_dir = project_path.join("output");

    // Remove and recreate output directory
    if output_dir.exists() {
        fs::remove_dir_all(&output_dir).await.map_err(|e| e.to_string())?;
    }
    fs::create_dir_all(&output_dir).await.map_err(|e| e.to_string())?;

    // Collect .md and .mmd files from the top-level directory only
    let mut all_files = Vec::new();
    let mut dir = tokio::fs::read_dir(&project_path).await.map_err(|e| e.to_string())?;
    while let Some(entry) = dir.next_entry().await.map_err(|e| e.to_string())? {
        let path = entry.path();
        if path.is_file() {
            if let Some(ext) = path.extension().and_then(|s| s.to_str()) {
                if ext == "md" || ext == "mmd" {
                    all_files.push(path);
                }
            }
        }
    }
    all_files.sort();

    let mut combined_content = String::new();
    let mut mmd_counter = 0;

    for file in all_files {
        if file.extension().and_then(|s| s.to_str()) == Some("md") {
            let content = fs::read_to_string(&file).await.map_err(|e| e.to_string())?;
            combined_content.push_str("\n");
            combined_content.push_str("\\pagebreak");
            combined_content.push_str("\n");
            combined_content.push_str(&content);
            combined_content.push_str("\n");
        } else if file.extension().and_then(|s| s.to_str()) == Some("mmd") {
            mmd_counter += 1;
            let output_file = format!("diagram_{}.png", mmd_counter);
            let output_path = output_dir.join(&output_file);
            let output = Command::new("mmdc")
                .arg("-i")
                .arg(&file)
                .arg("-o")
                .arg(&output_path)
                .arg("--theme")
                .arg("dark")
                .arg("--backgroundColor")
                .arg("transparent")
                .arg("--scale")
                .arg("3")
                .output()
                .map_err(|e| e.to_string())?;
            if !output.status.success() {
                return Err(String::from_utf8_lossy(&output.stderr).to_string());
            }

            combined_content.push_str(&format!("![{}]({})\n\n", output_file, output_file));
        }
    }

    let project_md = output_dir.join("project.md");
    fs::write(&project_md, &combined_content).await.map_err(|e| e.to_string())?;

    // Create LaTeX header file for PDF customization
    let latex_code = r#"
\usepackage{pagecolor}
\usepackage{fontspec}
\setmainfont{Arial}
\definecolor{background}{RGB}{19,23,31}
\definecolor{text}{RGB}{255,255,255}
\pagecolor{background}
\color{text}
"#;
    let header_path = output_dir.join("header.tex");
    fs::write(&header_path, latex_code).await.map_err(|e| e.to_string())?;

    // Convert to PDF with custom header
    let output = Command::new("pandoc")
        .arg("project.md")
        .arg("-o")
        .arg("project.pdf")
        .arg("--include-in-header")
        .arg("header.tex")
        .arg("--pdf-engine")
        .arg("xelatex")
        .current_dir(&output_dir)
        .output()
        .map_err(|e| e.to_string())?;
    if !output.status.success() {
        return Err(String::from_utf8_lossy(&output.stderr).to_string());
    }

    let pdf_path = output_dir.join("project.pdf");
    Ok(pdf_path.to_string_lossy().to_string())
}

////////
// EXECUTE
////////

// @function run
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        // Initialize the shared reqwest client in the app state
        .manage(AppState {
            client: reqwest::Client::new(),
        })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            chat,
            get_local_models,
            get_project_info,
            read_file,
            save_file,
            export_markdown
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
