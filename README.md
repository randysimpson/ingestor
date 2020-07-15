# Ingestor

This project was created to allow for the ingestion of metrics into a MongoDB.  The metrics will be queued up when there are too many, but there is no local storage.  The purpose of this is that when there is a large amount of metrics incoming, there could be more containers added to handle the workload.

In the future the project may be modified to allow for use of PostgresSQL database.

## Description

When this application is running you can post metrics to port `3000` and endpoint `/api/v1/data` and the metrics will be queued and then stored into the MongoDB.  These metrics do not need to have any specific format, but I would suggest that there is a name and a date associated.

## Prerequisites

There must be a running MongoDB instance running that is accessible on the network.  The database can be setup on a dedicated machine or it could be a MongoDB cluster, or it could be a container using Persistent Volume storage on Kubernetes environment.  To setup using Kubernetes please follow the blog [Setup MongoDB on Kubernetes](https://simpsonhouse.hopto.org) on https://simpsonhouse.hopto.org

## Usage

The code can be downloaded and executed or can be run as a container.  The easiest way is to run as a container by utilizing the following Kubernetes yaml file:

```
kubectl create -f https://raw.githubusercontent.com/randysimpson/ingestor/master/ingestor.yaml --edit
```

## Variables

variables are defined as follows:

##### DB_URL

This is url for the mongodb location.  An appropriate value looks like `mongodb://localhost:27017`.

##### DB_NAME

This is the name for the database where the metrics will be stored.  An example could be `metrics`.

##### POD_NAME

Optional parameter for the pod name to report metrics about the queue.

##### QUEUE_POP_COUNT

Optional parameter for the number of queued items to be pop'd off the stack at a time, default is 75.

##### QUEUE_DURATION

Optional parameter for the duration in ms to wait before pushing the metrics to the database, default is 60000 ms (1 min).

## Download the code

The code can be downloaded by using:

```sh
git clone https://gitbub.com/randysimpson/ingestor.git
cd ingestor
npm start
```

## Docker

To run the Ingestor as a container then issue the following command:

```sh
docker run -e "DB_URL=mongodb://mongosvc:27017" -e "DB_NAME=metrics" -p 3000:3000 -d randysimpson/ingestor:latest
```

## Kubernetes

Creating a deployment for the Ingestor if you are using the DB_URL of `mongodb://mongosvc:27017` and DB_NAME of `metrics`:

```sh
kubectl create -f https://raw.githubusercontent.com/randysimpson/ingestor/master/ingestor.yaml
```

The yaml file includes a deployment as well as a service and can be found at https://raw.githubusercontent.com/randysimpson/ingestor/master/ingestor.yaml.

#### Scale Deployment

To scale the deployment you will only need to adjust the number of Ingestors:

```sh
kubectl scale deployment.v1.apps/ingestor --replicas=3
```

#### Copyright

Copyright (©) 2019 - Randall Simpson
