# ingestor

This project was created to allow for the ingestion of metrics into a mongodb.  The metrics will be queued up when there are too many, but there is no local storage.  The purpose of this is that when there is a large amount of metrics incoming, there could be more containers added to handle the workload.

# Description

When this application is running you can post metrics to port `3000` and endpoint `/api/v1/data` and the metrics will be queued and then stored into the mongodb.  These metrics do not need to have any specific format, but I would suggest that there is a name and a date associated.

## Prerequisites

There must be a running mongodb instance running that is accessible on the network.  If you want to setup the mongodb as a deployment on Kubernetes environment, please follow the blog on https://simpsonhouse.hopto.org

## Usage

The code can be downloaded and executed or can be run as a container.  The easiest way is to run as a container by utilizing the following Kubernetes yaml file:

```
kubectl create -f https://raw.githubusercontent.com/randysimpson/ingestor/master/ingestor.yaml
```

## Variables

variables are defined as follows:

##### DB_URL

This is url for the mongodb location.  An appropriate value looks like `mongodb://localhost:27017`.

##### DB_NAME

This is the name for the database where the metrics will be stored.  An example could be `metrics`.

##### POD_NAME

Optional parameter for the pod name to report metrics about the queue.

## Download the code

The code can be downloaded by using:

```sh
git clone https://gitbub.com/randysimpson/ingestor.git
cd ingestor
npm start
```

## Docker

To run the ingestor as a container then issue the following command:

```sh
docker run -ti randysimpson/ingestor:1.0 -e "DB_URL=mongodb://mongosvc:27017" -e "DB_NAME=metrics"
```

## Kubernetes

Creating a deployment for the ingestor if you are using the DB_URL of `mongodb://mongosvc:27017` and DB_NAME of `metrics`:

```sh
kubectl create -f https://raw.githubusercontent.com/randysimpson/ingestor/master/ingestor.yaml
```

The yaml file includes a deployment as well as a service and can be found at https://raw.githubusercontent.com/randysimpson/ingestor/master/ingestor.yaml.

#### Scale Deployment

To scale the deployment you will only need to adjust the number of ingestors:

```sh
kubectl scale deployment.v1.apps/ingestor --replicas=3
```

#### Copyright

Copyright (©) 2019 - Randall Simpson
