## Setup

```
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

The input JSON would depend on the specific data you want to add or query.

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
