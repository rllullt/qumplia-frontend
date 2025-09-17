# QumplIA Frontend

Qumplia is a SaaS platform for the finance industry (banks and insurance companies) that automates the regulatory compliance of promotions and campaigns using AI, registering every step of the process on a blockchain like the Vara Network.

This frontend application is a web interface built for managing marketing campaigns, allowing users to create new ones, and to visualize and edit existing ones.
It connects to the QumplIA Backend (main API) and the Vara Network to offer a smooth and reactive user experience.



## Tech stack

* **Framework:** React 18
* **Language:** TypeScript
* **Bundler:** Vite
* **Styles:** Tailwind CSS with DaisyUI
* **State Management:** None


## Prerequisites

Make sure to have the following packages installed:
* Node.js (v22.x or higher). You can use [nvm](https://github.com/nvm-sh/nvm) for versioning.
* Yarn (v1.x).
* Python 3 (for virtual environment —optional— and the test server).


## Installation

1.  **Clone the repository:**
    ```bash
    git clone git@github.com:rllullt/qumplia-frontend.git
    cd qumplia-frontend
    ```

2.  **Install dependencies:**
    It is recommended to use `yarn`.
    ```bash
    npm install -g yarn
    yarn install
    ```

    Or using a python virtual environment for the installation of npm and the packages:
    ```bash
    python3 -m venv env
    source env/bin/activate
    python3 -m pip install nodeenv
    nodeenv --python-virtualenv --node=lts
    npm install -g yarn
    yarn install
    ```

4.  **Environment variables:**
    For development, you have to set up a file called `.env`, to store necessary environment variables for the application to run.
    An example can be found in `.env.example`.
    You can copy it and add the necessary variables into `.env`.
    ```bash
    cp .env.example .env
    ```

    For production, you have to set up a file similar to the environment file for testing running, but with the variables you’re going to use for production (often different).
    This is done in a file that you must call `.env.production`.
    The build command reads from this file when building the app.
    ```bash
    cp .env.example .env.production
    ```


## Usage and available scripts

* **Run in dev mode:**
    ```bash
    npm run dev
    ```
    The app will be running on `http://localhost:5173`.

* **Build for production:**
    ```bash
    npm run build
    ```
    This command uses the variables from `.env.production` file and generates the static files into the folder `dist/`.

* **Test production files:**
    You can test the production files with a simple python server, by moving to the `dist/` folder and running an http.server:
    ```bash
    cd dist/
    python3 -m http.server 8000
    ```
    The app will be visible on `http://localhost:8000`.


## License

This project is under MIT License.
