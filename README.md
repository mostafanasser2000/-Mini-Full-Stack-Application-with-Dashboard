# Mini Full-Stack Pharmacy Application with Dashboard

A mini full-stack pharmacy application built using **Django REST framework** for the backend and **React** for the front end. This application allows pharmacy staff and doctors to manage medications, refill requests, and request approvals/rejections, all through a dashboard interface.

## Tech Stack

- **Frontend:** React, Bootstrap, TailwindCSS
- **Backend:** Django REST framework
- **Containerization:** Docker, Docker Compose

## Demo

## Video Preview
[![Task Preview]]([https://youtu.be/ZL2KEv2FGI8))
## Features

- **JWT Authentication** for secure login and access control
- **Medication Management**: List all medications and perform CRUD operations (create, read, update, delete) for staff
- **Refill Requests**: Doctors can submit refill requests for medications (currently supports one medication per request)
- **Request Approval/Rejection**: Staff can approve or reject refill requests
- **Dashboard**: Separate dashboards for staff and doctors displaying refill requests and their current status

## Installation (Docker)

Follow these steps to set up the application locally using Docker:

### Prerequisites

Ensure you have **Docker** and **Docker Compose** installed on your device. If not, you can download and install them from [Docker's official website](https://www.docker.com/get-started).

### Steps

- **Clone the repository:**

  ```bash
  git clone https://github.com/your-username/job-board-portal.git
  cd job-board-portal

  ```

- Create `.env` file at `django_project` directory and add the following to it

```bash
DJANGO_SECRET_KEY=yAF70aC5MHa215Vav1Q2ZdIGvDWZkiTbPo2TEu9ha9A
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=0.0.0.0,localhost
SQLITE_URL=sqlite:///db.sqlite3
POSTGRES_URL=postgresql://postgres:postgres@db:5432/pharmacy
DB_HOST=db
DB_PORT=5432
DB_NAME=pharmacy
DB_USER=postgres
DB_PASSWORD=postgres
```

- Create `.env` file in the the project directory and add the fields beginning with `DB` from the above.

- Build the Docker images:

```bash
docker compose build
```

- Run the containers

```bash
docker compose up
```

- If everything runs successfully, you will have:

  - The `Backend` running at `http://localhost:8000/` or `http://0.0.0.0:8000/`

  - The `Frontend` running at `http://localhost:3000/` or `http://0.0.0.0:3000/`

- To interact with the backend from the React app Navigate to `http://localhost:3000/` or `http://0.0.0.0:3000/` on your browser

- **Access the application**
  - Open your browser and go to `http://localhost:3000/` (React app frontend).
  - the backend API will be accessible at `http://localhost:8000/`

## Default Admin User

When the Docker containers start, a default admin user is created to facilitate testing. You can use the following credentials:

- `email`: `admin@gmail.com`
- `password`: `admin`

You must sign up as a doctor to interact with refill requests.

## API Reference

To view the API documentation, navigate to `http://localhost:8000/api/v1/swagger-ui/` in your browser.

## Future Development

- Support for multiple medications per refill request.
- Improved user roles and permissions (e.g., pharmacy staff, doctors).
- User-friendly frontend improvements, such as form validation and error handling.
- Enhance authentication features.
