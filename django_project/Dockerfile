FROM python:3.10.4-slim-bullseye

# Create environment variable
ENV PYTHONDONTWRITEBYTECODE 1
ENV PIP_DISABLE_PIP_VERSION_CHECK 1
ENV PYTHONUNBUFFERED 1

# Set working directory
WORKDIR /usr/src/app

# Install dependenices
RUN apt-get update && apt-get install -y netcat
COPY ./requirements.txt .
RUN python3 -m pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

EXPOSE 8000

CMD [ "python3", "manage.py", "runserver", "0.0.0.0:8000"]