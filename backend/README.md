# RescueBite Spring Boot Backend

Production REST API for the **RescueBite** Food Rescue and Redistribution Platform, built with **Spring Boot 3.2**, **Spring Security (JWT)**, and **Spring Data JPA** with **MySQL 8.0**.

---

## 1. Quick Start

### Prerequisites
- Java 17 or higher
- Maven 3.8+
- MySQL 8.x (running locally on port 3306)

### Running the Application
```bash
# 1. Navigate to the backend directory
cd backend

# 2. Build and run with Maven
mvn spring-boot:run
```

Alternatively, build an executable JAR:
```bash
mvn clean package
java -jar target/rescuebite-backend-1.0.0.jar
```

The server starts at `http://localhost:8080`.

---

## 2. Configuration (`application.properties`)

Edit `src/main/resources/application.properties` to match your local MySQL credentials:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/rescuebite_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=rootpassword
spring.jpa.hibernate.ddl-auto=update
app.jwt.secret=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
app.cors.allowed-origins=http://localhost:3000
```

---

## 3. Connecting to the React Frontend

1. In the project root, open `.env` (or copy from `.env.example`):
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api
   VITE_USE_LIVE_API=true
   ```
2. Start the React dev server:
   ```bash
   npm run dev
   ```
3. All Axios API requests in `src/services/donationService.ts` and `src/services/apiClient.ts` will automatically communicate with your running Spring Boot backend with full JWT authorization headers.

---

## 4. API Endpoints Reference

### Authentication (`/api/auth`)
* `POST /api/auth/register` — Register a new Food Donor or Recipient Organization.
* `POST /api/auth/login` — Sign in and receive JWT token + user profile.

### Donations (`/api/donations`)
* `GET /api/donations` — Query all listings with optional parameters (`?category=...&status=...&search=...`).
* `GET /api/donations/{id}` — Retrieve donation listing details.
* `POST /api/donations` — Create a new surplus listing (Requires `ROLE_DONOR`).
* `POST /api/donations/{id}/claims` — Reserve and claim donation (Requires `ROLE_RECIPIENT`).
* `PATCH /api/donations/{id}/status` — Advance status (`AVAILABLE`, `RESERVED`, `PICKUP_SCHEDULED`, `COLLECTED`, `COMPLETED`, `CANCELLED`).

### Administration (`/api/admin`)
* `GET /api/admin/verifications` — List organization verification applications.
* `PATCH /api/admin/verifications/{id}?status=approved` — Approve or reject charity partners.
* `GET /api/admin/audit-logs` — Fetch immutable chain of custody logs.
