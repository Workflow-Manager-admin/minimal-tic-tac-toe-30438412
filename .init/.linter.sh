#!/bin/bash
cd /home/kavia/workspace/code-generation/minimal-tic-tac-toe-30438412/web_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

