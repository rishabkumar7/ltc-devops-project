from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from azure.cosmos import CosmosClient
from dotenv import load_dotenv
import os
from typing import Optional

# Load environment variables from .env file
load_dotenv()

app = FastAPI()


# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the Cosmos DB client using environment variables
endpoint = os.getenv("CosmosDBEndpoint")
key = os.getenv("CosmosDBKey")

if not endpoint or not key:
    raise ValueError("CosmosDBEndpoint and CosmosDBKey must be set in the .env file")

client = CosmosClient(endpoint, key)

# Get a reference to the database and container
database = client.get_database_client("TvShows")
container = database.get_container_client("TvShowsContainer")

@app.get("/")
async def root():
    return {"message": "Welcome to the TV Shows API!"}

@app.get("/api/shows")
async def get_tv_shows():
    try:
        query = "SELECT c.id, c.title FROM c"
        items = list(container.query_items(query=query, enable_cross_partition_query=True))
        return items
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error accessing Cosmos DB")

@app.get("/api/seasons")
async def get_seasons(show_id: Optional[str] = Query(None, title="Show ID")):
    if not show_id:
        raise HTTPException(status_code=400, detail="Please provide a show_id query parameter. If unaware of the showId, check out the /api/shows endpoint.")

    try:
        query = "SELECT c.seasons FROM c WHERE c.id = @showId"
        parameters = [{"name": "@showId", "value": show_id}]
        
        items = list(container.query_items(
            query=query,
            parameters=parameters,
            enable_cross_partition_query=True
        ))

        if not items:
            return {"message": "No seasons found for the given show ID"}
        
        return items[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error querying Cosmos DB: {str(e)}")