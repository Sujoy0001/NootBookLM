
FROM python:3.11-slim AS build

WORKDIR /

# Install build dependencies (only needed during build)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

# Upgrade pip and install dependencies into the /install directory
RUN pip install --upgrade pip \
    && pip install --prefix=/install --no-cache-dir -r requirements.txt


# ---------- RUN STAGE ----------
FROM python:3.11-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH="/install/bin:$PATH" \
    # CRITICAL FIX: Tell Python where to find the installed packages
    PYTHONPATH="/install/lib/python3.11/site-packages:$PYTHONPATH"

# Copy only installed packages from build stage
COPY --from=build /install /install

# Create non-root user first
RUN useradd -m -r appuser

# Copy app source code AND change ownership to appuser in one step
COPY --chown=appuser:appuser . .

# Switch to the non-root user
USER appuser

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]