# QumplIA Frontend

## Installation

It is recommended to use a python virtual environment for the installation of npm and the packages.
```bash
python3 -m venv env
source env/bin/activate
python3 -m pip install nodeenv
nodeenv --python-virtualenv --node=lts
npm install -g yarn
yarn install
```

Then, the application can be run with:
```bash
npm run dev
```
