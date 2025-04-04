FROM python:3.11-slim

WORKDIR /app

COPY ./tests /app/tests

RUN pip install requests

CMD ["python", "/app/tests/test.py"]
