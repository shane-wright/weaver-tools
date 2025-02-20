use serde_json::json;
use tauri::State;
use tokio::sync::Mutex;
use rusqlite::{params, Connection, Result};
use reqwest;
use std::sync::Arc;

////////
// AI
////////

#[tauri::command]
async fn chat(model: String, messages: Vec<serde_json::Value>) -> Result<String, String> {
    let client = reqwest::Client::new();
    let response = client.post("http://localhost:11434/api/chat")
        .json(&json!({
            "model": model,
            "messages": messages,
            "stream": false
        }))
        .send()
        .await
        .map_err(|e| e.to_string())?;

    response.text()
        .await
        .map_err(|e| e.to_string())
}

// @func get_local_models
#[tauri::command]
async fn get_local_models() -> Result<Vec<serde_json::Value>, String> {
    let client = reqwest::Client::new();
    let response = client.get("http://localhost:11434/api/tags")
        .send()
        .await
        .map_err(|e| e.to_string())?;

    let data: serde_json::Value = response.json()
        .await
        .map_err(|e| e.to_string())?;

    let models = data["models"].as_array().unwrap_or(&vec![])
        .iter()
        .map(|model| {
            let name = model["name"].as_str().unwrap_or("").to_string();
            let description = name.split(':').next().unwrap_or("").replace('-', " ");
            json!({"name": name, "description": description})
        })
        .collect();

    Ok(models)
}

////////
// DB
////////

type DbConnection = Arc<Mutex<Connection>>;

// @func initialize_db
#[tauri::command]
async fn initialize_db(db: State<'_, DbConnection>) -> Result<(), String> {
    let conn = db.lock().await;
    conn.execute(
        "CREATE TABLE IF NOT EXISTS chat_history (
            id TEXT PRIMARY KEY NOT NULL,
            description TEXT NOT NULL,
            messages TEXT NOT NULL
        )",
        [],
    ).map_err(|e| e.to_string())?;

    conn.execute(
        "CREATE TABLE IF NOT EXISTS profiles (
            id TEXT PRIMARY KEY NOT NULL,
            preferences TEXT NOT NULL
        )",
        [],
    ).map_err(|e| e.to_string())?;

    Ok(())
}

////////
// CHAT_HISTORY
////////

// @func create_chat_dialog (chat_
#[tauri::command]
async fn create_chat_dialog(db: State<'_, DbConnection>, id: String, description: String, messages: String) -> Result<(), String> {
    let conn = db.lock().await;
    conn.execute(
        "INSERT INTO chat_history (id, description, messages) VALUES (?1, ?2, ?3)",
        params![id, description, messages],
    ).map_err(|e| e.to_string())?;
    Ok(())
}

// @func update_chat_dialog
#[tauri::command]
async fn update_chat_dialog(db: State<'_, DbConnection>, id: String, messages: String) -> Result<(), String> {
    let conn = db.lock().await;
    conn.execute(
        "UPDATE chat_history SET messages = ?1 WHERE id = ?2",
        params![messages, id],
    ).map_err(|e| e.to_string())?;
    Ok(())
}

// @func get_chat_dialog
#[tauri::command]
async fn get_chat_dialog(db: State<'_, DbConnection>, id: String) -> Result<Vec<String>, String> {
    let conn = db.lock().await;
    let mut stmt = conn.prepare("SELECT * FROM chat_history WHERE id = ?1")
        .map_err(|e| e.to_string())?;
    let messages = stmt.query_map([id], |row| row.get(2))
        .map_err(|e| e.to_string())?
        .filter_map(Result::ok)
        .collect::<Vec<String>>();
    Ok(messages)
}

// @func get_chat_history
#[tauri::command]
async fn get_chat_history(db: State<'_, DbConnection>) -> Result<Vec<(String, String, String)>, String> {
    let conn = db.lock().await;
    let mut stmt = conn.prepare("SELECT id, description, messages FROM chat_history")
        .map_err(|e| e.to_string())?;
    let history = stmt.query_map([], |row| {
        Ok((row.get(0)?, row.get(1)?, row.get(2)?))
    })
    .map_err(|e| e.to_string())?
    .filter_map(Result::ok)
    .collect();
    Ok(history)
}

////////
// PROFILES
////////

// @func create_profile
#[tauri::command]
async fn create_profile(db: State<'_, DbConnection>, id: String, preferences: String) -> Result<(), String> {
    let conn = db.lock().await;
    conn.execute(
        "INSERT INTO profiles (id, preferences) VALUES (?1, ?2)",
        params![id, preferences],
    ).map_err(|e| e.to_string())?;
    Ok(())
}

// @func update_profile
#[tauri::command]
async fn update_profile(db: State<'_, DbConnection>, id: String, preferences: String) -> Result<(), String> {
    let conn = db.lock().await;
    conn.execute(
        "UPDATE profiles SET preferences = ?1 WHERE id = ?2",
        params![preferences, id],
    ).map_err(|e| e.to_string())?;
    Ok(())
}


// @func get_profiles
#[tauri::command]
async fn get_profiles(db: State<'_, DbConnection>) -> Result<Vec<(String, String, String)>, String> {
    let conn = db.lock().await;
    let mut stmt = conn.prepare("SELECT id, email, preferences FROM profiles")
        .map_err(|e| e.to_string())?;
    let profiles = stmt.query_map([], |row| {
        Ok((row.get(0)?, row.get(1)?, row.get(2)?))
    })
    .map_err(|e| e.to_string())?
    .filter_map(Result::ok)
    .collect();
    Ok(profiles)
}

////////
// FILES
////////

// @func get_source_code
#[tauri::command]
async fn get_source_code(project_path: String) -> Result<Vec<String>, String> {
    use std::process::Command;
    let output = Command::new("bash")
        .arg("-c")
        .arg(format!(
            "cd {} && find . -type f ! -path './src/lib/*' ! -path './src-tauri/target/*' ! -path './node_modules/*'",
            project_path
        ))
        .output()
        .map_err(|e| e.to_string())?;
    
    if output.status.success() {
        let files = String::from_utf8_lossy(&output.stdout)
            .lines()
            .map(|line| line.to_string())
            .collect();
        Ok(files)
    } else {
        Err(String::from_utf8_lossy(&output.stderr).to_string())
    }
}

// @func read_file
#[tauri::command]
async fn read_file(file_path: String) -> Result<String, String> {
    use tokio::fs::File;
    use tokio::io::AsyncReadExt;

    let mut file = File::open(file_path).await.map_err(|e| e.to_string())?;
    let mut contents = String::new();
    file.read_to_string(&mut contents).await.map_err(|e| e.to_string())?;
    Ok(contents)
}

////////
// EXECUTE
////////

// @func run
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let db_conn = Arc::new(Mutex::new(Connection::open("chat.db").expect("Failed to open database")));

    tauri::Builder::default()
        .manage(db_conn)
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![chat, get_local_models, initialize_db, create_chat_dialog, update_chat_dialog, get_chat_dialog, get_chat_history, create_profile, update_profile, get_profiles, get_source_code, read_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

