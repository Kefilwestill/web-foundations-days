# SnapShare Scaling Plan

## Assumptions

Starting facts:

- 10 million registered users
- 10% active each day
- Each active user uploads 1 photo per day
- Each active user views 50 feed pages per day
- Average photo size = 2 MB
- Average thumbnail size = 50 KB

### Daily Active Users

10,000,000 × 10%

= 1,000,000 daily active users

---

## Traffic Estimates

### Uploads Per Day

1,000,000 users × 1 photo

= 1,000,000 uploads/day

### Uploads Per Second

1,000,000 ÷ 86,400

≈ 11.6 uploads/second

≈ 12 uploads/second

---

### Feed Views Per Day

1,000,000 users × 50 views

= 50,000,000 feed views/day

### Average Feed Views Per Second

50,000,000 ÷ 86,400

≈ 579 views/second

---

### Peak Feed Views Per Second

Using 5× peak traffic:

579 × 5

≈ 2,895 views/second

≈ 2,900 views/second

---

## Storage Estimate

### Storage Per Photo

Photo:

2 MB

Thumbnail:

50 KB

Total:

2.05 MB

---

### Storage Per Year

1,000,000 uploads/day × 365

= 365,000,000 photos/year

365,000,000 × 2.05 MB

= 748,250,000 MB

≈ 748 TB per year

---

## Read-Heavy or Write-Heavy?

SnapShare is read-heavy.

There are approximately:

- 1 million uploads per day
- 50 million feed views per day

Users spend much more time reading feeds than uploading photos.

Because reads greatly outnumber writes, the design uses:

- CDN
- Cache
- Database read replica

to reduce load on the main database.

---

## Why Photos Should Not Be Stored in the Database

Photos are large binary files and would make the database grow very quickly.

The database should store photo metadata only, such as:

- photo id
- user id
- upload time
- storage URL

Actual image files should be stored in object storage such as Amazon S3, Azure Blob Storage or Google Cloud Storage.

---

## Architecture Diagram

                    +----------------+
                    |      CDN       |
                    +-------+--------+
                            |
                            v
                    +----------------+
                    | Load Balancer  |
                    +-------+--------+
                            |
          +-----------------+-----------------+
          |                                   |
          v                                   v
 +----------------+                 +----------------+
 |  App Server 1  |                 |  App Server 2  |
 +-------+--------+                 +-------+--------+
         |                                  |
         +---------------+------------------+
                         |
                         v
                 +---------------+
                 |     Cache     |
                 +-------+-------+
                         |
                         v
                +------------------+
                | Primary Database |
                +--------+---------+
                         |
                         v
                +------------------+
                |  Read Replica    |
                +------------------+

                         |
                         v

                +------------------+
                | Object Storage   |
                | (Original Files) |
                +--------+---------+
                         |
                         v
                     Queue
                         |
                         v
                +------------------+
                | Thumbnail Worker |
                +------------------+

---

## Component Explanations

### CDN

Serves popular photos from locations close to users to reduce latency.

### Load Balancer

Distributes traffic across multiple app servers.

### App Servers

Handle requests such as uploads, feed generation and authentication.

### Cache

Stores frequently accessed feed data to reduce database queries.

### Primary Database

Stores user accounts, relationships, posts and photo metadata.

### Read Replica

Handles read-only queries and reduces pressure on the primary database.

### Object Storage

Stores original image files efficiently and at large scale.

### Queue

Stores background jobs waiting to be processed.

### Thumbnail Worker

Creates thumbnails without slowing down the user upload experience.

---

## Photo Upload Flow

1. User selects a photo and uploads it.
2. Request reaches the load balancer.
3. Load balancer sends request to an app server.
4. App server stores the original image in object storage.
5. App server saves metadata in the primary database.
6. App server sends a thumbnail-generation job to the queue.
7. User immediately receives a successful upload response.
8. Worker retrieves the job from the queue.
9. Worker generates a thumbnail.
10. Thumbnail is saved to object storage.
11. Database metadata is updated with the thumbnail location.
12. CDN later caches the photo and thumbnail for faster delivery.

---

## Trade-Offs

### Cache vs Fresh Data

Using a cache improves performance and reduces database load, but users may briefly see slightly outdated feed data.

### Read Replicas vs Consistency

Read replicas improve scalability, but replication delays can mean recent writes are not immediately visible.

### Queue Processing vs Simplicity

Background processing improves user experience because uploads finish faster, but it adds more infrastructure and operational complexity.

### CDN Cost vs Performance

CDNs improve speed worldwide, but increase infrastructure costs.