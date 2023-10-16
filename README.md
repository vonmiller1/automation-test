# Test Automation Playground

A sample web application and UI test suite for practicing browser-based test automation. The project includes a React frontend, a Spring Boot backend, and automated tests for the chart and grid interfaces. Some application defects are intentional and are part of the practice exercises.

## Project modules

| Module | Description |
| --- | --- |
| `frontend/` | React interface with login, signup, user profile, chart, and grid pages. |
| `backend/` | Spring Boot REST API with JWT authentication, user management, and MySQL persistence. |
| `domain/` | Selenide and TestNG page objects, browser configuration, assertions, and chart/grid UI tests. |
| `docker/` | Docker Compose configuration for the application, MySQL, and Selenoid browser automation. |

## Technology

- **Frontend:** React, MobX, Ant Design, `react-data-grid`, and `react-stockcharts`
- **Backend:** Java 8, Spring Boot, Spring Security, Liquibase, and MySQL
- **UI testing:** Java 8, Selenide, TestNG, and Selenoid for remote browser sessions
- **Build:** Gradle 4.8; the frontend build uses Node.js 10.5.0 and Yarn

## Requirements

Choose the tools required by the part of the project you want to run:

- Java 8
- Docker and Docker Compose for the containerized stack
- Yarn for standalone frontend development
- Chrome for local UI test execution

The Gradle frontend build downloads its configured Node.js version. These are legacy project dependencies; newer tool versions may require compatibility changes.

## Run the application with Docker

The Compose stack starts the application at `http://localhost:8090`, MySQL on port `3306`, and Selenoid on port `4444`.

1. Create a MySQL data directory containing `my.cnf` and a `datadir` directory. The MySQL configuration should enable the authentication mode required by your MySQL image.
2. In `docker/`, create a `.env` file with absolute paths for the MySQL directory and the Docker configuration directory:

   ```dotenv
   MYSQL_FOLDER=/absolute/path/to/mysql
   ```

   `MYSQL_FOLDER` must contain `my.cnf` and `datadir`. Also set `PWD` in the `.env` file to the absolute path of the repository's `docker/` directory; Compose uses it to mount the Selenoid configuration.
3. From the repository root, build the application image and start the services:

   ```bash
   ./gradlew clean buildDocker
   docker-compose -f docker/docker-compose.yml up -d
   ```

   On Windows, use `gradlew.bat` instead of `./gradlew`.

Stop the services with:

```bash
docker-compose -f docker/docker-compose.yml down
```

The application container reads its database connection from the `DATABASE_*` environment variables defined in the Compose file. MySQL data is persisted in the host directory configured by `MYSQL_FOLDER`.

## Run the frontend separately

Start the backend and a MySQL instance first. The backend defaults to `localhost:3306`, database `test`, username `root`, and an empty password; update `backend/src/main/resources/application.yml` if your local database differs.

Then start the React development server:

```bash
cd frontend
yarn install
yarn start
```

The frontend is served at `http://localhost:3000` and uses the API at `http://localhost:8090/api` by default.

To build the frontend for production:

```bash
cd frontend
yarn build
```

## Run the UI tests

The `domain` module contains UI tests for the chart and grid pages. Start the application before running the tests.

For local Chrome execution against a locally running frontend:

```bash
./gradlew -p domain clean test -Dsuite=local -DappHost=localhost -DappPort=3000
```

For remote browser execution using the Docker/Selenoid setup:

```bash
./gradlew -p domain clean test -Dsuite=remote -DappHost=react -DappPort=8090
```

On Windows, use `gradlew.bat` in place of `./gradlew`. The remote test configuration expects the browser and application to be reachable within the Docker network.

## Practice exercises

The chart and grid interfaces include behavior designed for automation practice, and the backend also contains an exercise. Explore the application and tests to identify the intended issues. Elements across the interface use `data-qa` attributes to support stable test locators.

For chart or grid data that updates automatically, set `AUTOUPDATE_CHART` or `AUTOUPDATE_GRID` to `true` in `frontend/src/constants/index.js`.
