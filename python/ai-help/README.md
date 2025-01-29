## Setup

```
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

The input JSON would depend on the specific data you want to add or query.

Here are some examples:

For /add:

- Adding text:

```
{
  "data": "This is a sample text to be added."
}
```

- Adding a document:

```
{
  "data": {
    "file_path": "path/to/your/document.pdf"
  }
}
```

- Adding data with a custom id:

```
{
  "data": "This is another sample text.",
  "id": "my-custom-id"
}
```

- Query

```
{
  "query": "What is the sample text about?"
}
```
