#!/bin/bash

anker=$(pwd)

cd backend

npm run test
if [[ $? -ne 0 ]]
then
    echo 'backend jest tests failed'
    exit 1
fi

cd ${anker}/frontend

npm run test
if [[ $? -ne 0 ]]
then
    echo 'frontend jest tests failed'
    exit 1
fi

npm run build
if [[ $? -ne 0 ]]
then
    echo 'npm run build failed'
    exit 1
fi

cd ${anker}
rm -rv ./backend/build
cp -rv ./frontend/dist ./backend/build

