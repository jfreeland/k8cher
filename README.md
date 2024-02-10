# K8cher

**TODO**: <https://github.com/tilt-dev/debugger-examples/blob/master/dotnet/.vscode/launch.json>

---

An opinionated/experimental getting started project leveraging Kubernetes, Tilt, Dapr, and SvelteKit. This is a work in progress!

Skip to the [Quick Start](#quick-start)!

I always enjoy "developer experience" and this repository is being leveraged to experiment with different technologies and streamlining  workflows. I hope to learn valuable lessons and share with others what I am doing.

When you execute `tilt up` this project currently creates the following in a Kubernetes cluster:

* [Proxy Service - .NET 6 preview 7 Minimal API](./src/k8cher.proxy/README.md)
* [Auth service .NET 6 preview 7](./src/k8cher.auth/README.md)
* 'Store' service (experimenting using Dapr actor to sync svelte frontend store)
* Dapr for sidecars, plugin components, and secret management
* PostgreSQL
* pgAdmin
* Database migration with Kubernetes Job
* Local Kubernetes secret store (intended to leverage Dapr secret component for a Key vault in production)

There is a svelteKit frontend that can currently be run separately: [Running Svelte](#running-svelte)

# Goals

This starter kit leverages [Tilt](https://tilt.dev/) to provide a productive environment for development which includes:

* The ability to start all services and databases with a single command (after initial prereqs installed)
* Automatically reload all services on file changes
* Ability to be deployed to production with minimal changes
* Secrets integration
* Authn/z integration
* Database and pgAdmin tools setup
* Ability to easily integrate your own services and focus on business logic

Get started fast! The tools are preconfigured and kubectl, helm, and other tools can be learned over time.

# Prerequisites

* [Docker Desktop with Kubernetes enabled](https://docs.docker.com/desktop/)
* Kubectl is installed with Docker Desktop, confirm by typing `kubectl` in the terminal. If you don't have it, [Install it](https://kubernetes.io/docs/tasks/tools/)
* [Helm CLI](https://helm.sh/docs/intro/install/)
* [Tilt](https://github.com/tilt-dev/tilt/releases) - This is the link to tilt.exe. [If tools are not accessible on command line follow these steps.](./docs/setup-path.md)

# Quick Start

1) Ensure the [Prerequisites are installed](#prerequisites)
2) Clone repository `git clone https://github.com/michaelkacher/k8cher`
3) cd into directory `cd k8cher`
4) `tilt up`. You will see a message in the terminal that you can press space bar to open the Tilt Dashboard. Open it and watch the status of the services starting.

* Note: There is an intermittent first time bug I am chasing down that will only occur with the bitnami helm chart for postgres (has never occured with other helm charts). When browsing the Tilt Dashboard (the one accessed by pressing space bar) if there is an error in the Tiltfile, execute the following in the terminal: `helm repo add bitnami https://charts.bitnami.com/bitnami` and run again.

![Image of Tilt Dashboard](/docs/images/tilt-getting-started.png "Tilt Dashboard")

1) The dashboard shows the health of the services, if it shows 16/16 you are ready to go! This displays real time updates as changes to services are saved and it is rebuilt and deployed.
2) View the Swagger for the auth service by clicking the link in the 'Endpoints' column. The base path and port is that of the proxy, and all paths matching '/auth' are redirected to the auth service. A user can be registered through the swagger:
    * Click on the row that reads `Post /auth/register`
    * Click the "Try it out button"
    * Paste in the JSON below

        ```
        {
            "email": "michael.kacher@gmail.com",
            "password": "Passw0rd_"
        }
        ```

    * Click execute, you should see a 200 response
    * This creates the user but they cannot log in until the e-mail has been confirmed. Navigate to the local mail dev server at <http://localhost:1080/>
    ![maildev webpage](/docs/images/maildev.png "maildev webpage")
    * Click the confirmation link. If the web app is not running the redirect will not work but the account has still been confirmed.
    * Now a JWT for the user can be retrieved with a POST to /auth/login with the following JSON.

        ```
        {
        "email": "michael.kacher@gmail.com",
        "password": "Passw0rd_"
        }
        ```

3) View Resources can be selected to view the logs of all the services. You should see that creation of the user and login is logged.
4) Select the link for pgAdmin `localhost:5555`. NOTE: These secrets are set in the local Kubernetes secret store. The intention is that if deployed to production the Dapr Secret Management plugin is leveraged to integrate with AWS/Azure/GCP secret store.
    * At the login screen use the following credentials
        * Email Address / Username: `user@domain.com`
        * Password: `bouncingcow`
    * This brings you to the admin page, expand the database in the left hand browser and use `postgres` for the password
    * In the Browser panel expand `k8cher` database and expand Schema->public->Tables. You can right click and query the `AspNetUsers` table and confirm the users is there.
    ![pgAdmin Tool](/docs/images/pgadmin-query.png "pgAdmin Tool")

To cleanup the kubernetes resources do the following:

1) in the terminal  window running tilt, press `ctrl + c` to stop the service
2) execute `tilt down`

# Notes

* The proxy is currently setup to localhost:8088. If this conflicts with existing ports, navigate to the [helm chart values](./src/k8cher.proxy/values.yaml) and change the `port` under `service` from 8088 to desired port.

# Running Svelte

There is a svelte frontend that can be run separately to access the services.

### Starting Svelte dev environment

1) Ensure that [Node](https://nodejs.org/en/) is installed (version > 12)
2) cd into web directory: `cd src\k8cher.web`
3) install the npm dependencies: `npm install`
4) run the dev env: `npm run dev`
5) access it at <http://localhost:3000>

## TODO - mbk: break out into different  mini-tutorial files

# # Database

Recreate  migrations - delete Migrations folder content $`dotnet ef migrations add InitialCreate -- --environment Migration`.

# Attributions
