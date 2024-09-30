# LTC DevOps Project

This is the sample application for the DevOps Capstone Project.
It shows your favorite TV Shows or movies, the front-end is in React and the API is written in Python using FastAPI.

## Application

**Front-End** - A web application where users can view.

**API**: API that receives request to fetch TV Shows or Movies data, stored in NoSQL Database. For this sample app I am using CosmosDB from Azure. But you can modify the code according to your provider within the API.

## Running locally

### API

The API code exists in the `api` directory. You can run the API server locally:

- Clone this repo
- Make sure you are in the `api` directory
- Create a virtualenv by typing in the following command: `python -m venv .venv`
- Install the required packages: `pip install -r requirements.txt`
- Create a `.env` file, and add your CosmosDB connection details(only if you are using Azure CosmosDB), check  `.env.example`
- Also, change the API code depending on the data stored in your NoSQL Database in `main.py` accordingly
- Run the API server: `uvicorn main:app --reload`
- Your API Server should be running on port `http://localhost:8000`

### Front-end

The front-end code exits in the `frontend` directory. You can run the front-end server locally:

- Clone this repo
- Make sure you are in the `frontend` directory
- Install the dependencies: `npm install`
- Run the NextJS Server: `npm start`
- Your Front-end Server should be running on `http://localhost:3000`


## Goal

The goal is to get hands-on with DevOps practices like Containerization, CICD and monitoring.

Look at the capstone project for more detials.

## Author

[Rishab Kumar](https://github.com/rishabkumar7)

## License

[MIT](./LICENSE)