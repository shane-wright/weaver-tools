# Setup
### Must first have installed:
- Python
- Microsoft C++ Build Tools
- Rust

```
python -m venv venv

```

```
<!-- On Unix -->
source venv/bin/activate
```
```
<!-- On Windows -->
source venv/Scripts/activate
```
```
pip install -r requirements.txt
```
NOTE: If you run into issue with installing the requirements.txt, you may need to install Build tools (C compiler like Microsoft C++ build tools). Additionally if issues relating to requirements installation persist you may manually resolve those dependancies by installing the missing packages seperately: 
EXAMPLE: 
```
<!-- Missing numpy -->
pip install numpy
```
NOTE CONTINUED: Python versions newer than 3.12.3 have been identified as the culprit for many such errors as of 20250129

## The input JSON would depend on the specific data you want to add or query.

Here are some examples:

For /add:

- Adding a document:

```
curl --silent --header 'accept: application/json' --header 'content-type: application/json' --data '{
  "data": {
    "file_path": "TIBR-fullstack-skill-requirements.pdf"
  }
}' http://localhost:5000/add
```

- Query

```
curl --silent --header 'accept: application/json' --header 'content-type: application/json' --data '{
  "query": "What are the front end development requirements for TIBR?"
}' http://localhost:5000/query
```
