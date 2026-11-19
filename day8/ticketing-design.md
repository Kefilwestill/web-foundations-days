# TicketHub System Design

## 1. Requirements

### Functional Requirements

- Users can register and log in.
- Users can browse events.
- Users can search for events.
- Users can view available seats.
- Users can purchase tickets.
- Users can view purchase history.
- Event organizers can create events.

### Non-Functional Requirements

- High availability during ticket launches.
- Fast page loads.
- Strong consistency for seat purchases.
- Secure payment processing.
- Scalable architecture.
- Fault tolerance.


## 2. Estimates

### Users

- Registered users: 2,000,000
- Normal daily visitors: 50,000

### Normal Traffic

Page views:

50,000 × 10

= 500,000 page views/day

Average reads per second:

500,000 ÷ 86,400

≈ 6 reads/second

Ticket sales:

5,000/day

Writes per second:

5,000 ÷ 86,400

≈ 0.06 writes/second

### Popular Concert Sale

Users attempting purchase:

200,000

Available seats:

20,000

Time period:

10 minutes = 600 seconds

Purchase attempts per second:

200,000 ÷ 600

≈ 333 requests/second

Maximum successful purchases:

20,000 ÷ 600

≈ 33 purchases/second

This represents the peak load the system must handle.


## 3. API Design

### List Events

- Method: GET
- Path: /events
- Status: 200 OK

### Get Event Details

- Method: GET
- Path: /events/{id}
- Status: 200 OK

### List Available Seats

- Method: GET
- Path: /events/{id}/seats
- Status: 200 OK

### Purchase Ticket

- Method: POST
- Path: /tickets
- Status: 201 Created

### View User Tickets

- Method: GET
- Path: /users/{id}/tickets
- Status: 200 OK

### Create Event

- Method: POST
- Path: /events
- Status: 201 Created


## 4. Data Model

### Users

| Column | Type |
|----------|----------|
| user_id | BIGINT PK |
| name | VARCHAR |
| email | VARCHAR |

### Events

| Column | Type |
|----------|----------|
| event_id | BIGINT PK |
| title | VARCHAR |
| venue | VARCHAR |
| event_date | DATETIME |

### Seats

| Column | Type |
|----------|----------|
| seat_id | BIGINT PK |
| event_id | BIGINT FK |
| seat_number | VARCHAR |
| status | VARCHAR |

### Tickets

| Column | Type |
|----------|----------|
| ticket_id | BIGINT PK |
| user_id | BIGINT FK |
| seat_id | BIGINT FK |
| purchase_time | DATETIME |

### Relationships

- One user can own many tickets.
- One event can contain many seats.
- One seat can belong to only one event.
- One ticket belongs to one user and one seat.


## Preventing Double Booking

To prevent two people from buying the same seat:

1. Each seat record has a unique seat_id.
2. Purchases occur inside a database transaction.
3. The seat row is locked during purchase.
4. Only the first transaction succeeds.
5. Later transactions receive an error that the seat is no longer available.

This guarantees that one seat can only be sold once.


## 5. Architecture

### Diagram

                    Users
                       |
                       v
                    DNS
                       |
                       v
                     CDN
                       |
                       v
                Load Balancer
                  /        \
                 /          \
                v            v
        App Server 1    App Server 2
                \            /
                 \          /
                  v        v
                    Cache
                       |
                       v
                Primary Database
                       |
                       v
                  Read Replica

                       |
                       v

                     Queue
                       |
                       v

                    Worker


## Component Explanations

### DNS

Directs users to the system.

### CDN

Caches static content close to users.

### Load Balancer

Distributes requests across servers.

### App Servers

Process user requests and business logic.

### Cache

Reduces database reads.

### Primary Database

Stores transactional ticket data.

### Read Replica

Improves read scalability.

### Queue

Handles background jobs.

### Worker

Processes emails, receipts and notifications.


## GET /events Flow

1. User requests events.
2. Request reaches load balancer.
3. App server checks cache.
4. If cached, data is returned.
5. Cache miss triggers database query.
6. Result is stored in cache.
7. Response is returned.


## POST /tickets Flow

1. User selects a seat.
2. Request reaches app server.
3. Database transaction begins.
4. Seat record is locked.
5. Availability is checked.
6. Ticket record is created.
7. Seat status becomes SOLD.
8. Transaction commits.
9. Confirmation job enters queue.
10. Worker sends confirmation.


## 6. Trade-Offs

### Cache vs Fresh Data

Caching improves speed but may briefly show outdated seat availability.

### Consistency vs Performance

Strong consistency slightly reduces performance during ticket sales but prevents overselling seats.

### Read Replicas vs Replication Delay

Read replicas improve scalability but may briefly lag behind the primary database.


## Avoiding Single Points of Failure

- Multiple app servers prevent a single server outage from stopping the system.
- Load balancers can be deployed in pairs.
- Read replicas provide database redundancy.
- Object storage and backups protect ticket data.
- Queues allow jobs to survive temporary worker failures.