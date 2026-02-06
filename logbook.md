# Annexure III - ACTIVITY LOG BOOK

## Team Member 1: Admin & User Management
**Role Focus:** User Authentication, Admin Dashboard, User Management System, CSV Uploads.

| Date | No. of Hours | Task Assigned | Activities Performed | Key Learnings | Remarks |
|------|--------------|---------------|----------------------|---------------|---------|
| Day 1 | 4 | Project Setup | Initialized Mongoose models for Users. Set up Express server structure. | Database Schema Design, Express.js Setup | Completed |
| Day 2 | 4 | Authentication Logic | Implemented Login/Register backend logic with Bcrypt encryption. | Password Hashing, JWT Tokens | Completed |
| Day 3 | 4 | Admin Dashboard UI | Designed the main Admin Dashboard layout and sidebar navigation. | React Router, UI Components | Completed |
| Day 4 | 4 | User Schema Design | Defined detailed User schema (Name, Email, Role, etc.) in MongoDB. | Mongoose Models, Data Validation | Completed |
| Day 5 | 8 | User Fetch API | Created API endpoints to fetch single and all users for Admin view. | REST API design, Async/Await | Completed |
| Day 6 | 8 | Admin User UI | Built the frontend table to display users with filtering capabilities. | React State Management, API Integration | Completed |
| Day 7 | 8 | Add User Form | implemented "Add Single User" form logic and state management. | Form Handling, Input Validation | Completed |
| Day 8 | 8 | CSV Bulk Upload Backend | Implemented backend logic to parse CSV and bulk insert users. | File Parsing, Bulk Write Operations | Completed |
| Day 9 | 8 | CSV Bulk Upload Frontend| Integrated `papaparse` for frontend CSV reading and upload modal. | PapaParse Library, File I/O | Completed |
| Day 10| 8 | Password Auto-Gen | Refactored Add User to auto-generate passwords & email them. | NodeMailer, Crypto module | Completed |
| Day 11| 8 | Dashboard Stats | Implemented "Recent Activity" logic to aggregate user/donation logs. | Data Aggregation, Logic Optimization | Completed |
| Day 12| 8 | Final Testing & Refactor | Full end-to-end testing of User flow and Admin Dashboard. | Debugging, Code Cleanup | Completed |
| **Total**| **80** | | | | |

---

## Team Member 2: Donations & Payments
**Role Focus:** Donation Campaigns, Razorpay Integration, Transaction History, Tithe Logic.

| Date | No. of Hours | Task Assigned | Activities Performed | Key Learnings | Remarks |
|------|--------------|---------------|----------------------|---------------|---------|
| Day 1 | 4 | Requirement Analysis | Researched Razorpay API and Donation workflow requirements. | Payment Gateway Flows | Completed |
| Day 2 | 4 | Donation Schema | Designed MongoDB schema for Campaigns and Donation Records. | Relational Data Modeling | Completed |
| Day 3 | 4 | Backend Config | Set up Razorpay credentials and environment variables in backend. | API Security, Env Configuration | Completed |
| Day 4 | 4 | Payment API - Order | Created backend route to generate Razorpay Orders. | Razorpay Node.js SDK | Completed |
| Day 5 | 8 | Payment API - Verify | Implemented signature verification logic for secure transactions. | Cryptography, Webhooks | Completed |
| Day 6 | 8 | Donation UI Components | Built Donation Campaign cards and details page. | Responsive Design, Prop Drilling | Completed |
| Day 7 | 8 | Admin Campaign Crud | Created Admin interface to Add/Edit/Delete Donation/Tithe campaigns. | CRUD Operations, Modal UI | Completed |
| Day 8 | 8 | Campaign Refactoring | Refactored Campaign Form to inline style matching Product Admin. | Component Refactoring, React Hooks | Completed |
| Day 9 | 8 | Donation Logic | Connected frontend "Donate Now" button to Razorpay Checkout. | External Script Loading, Event Handling | Completed |
| Day 10| 8 | Transaction History | Created API and UI to fetch and display past donation history. | Data Fetching, Table Rendering | Completed |
| Day 11| 8 | Tithe Specifics | Implemented specific logic for "Monthly Tithe" vs "Campaigns". | Conditional Logic, Toggle States | Completed |
| Day 12| 8 | Integration Testing | Tested full payment flow from User Donate -> Admin Verification. | End-to-End Testing, Error Handling | Completed |
| **Total**| **80** | | | | |

---

## Team Member 3: Shop & Merchandise
**Role Focus:** Merchandise Schema, Product Image Handling, Shopping Cart, Order Management.

| Date | No. of Hours | Task Assigned | Activities Performed | Key Learnings | Remarks |
|------|--------------|---------------|----------------------|---------------|---------|
| Day 1 | 4 | Shop Requirements | Defined requirements for Merchandise store and Cart functionality. | E-commerce Logic | Completed |
| Day 2 | 4 | Product Schema | Created Mongoose schema for Products (Price, Stock, Image). | Schema Design | Completed |
| Day 3 | 4 | Image Handling R&D | Researched storage options; decided on Base64 for simplicity. | Data URLs, Blob Constraints | Completed |
| Day 4 | 4 | Product Upload API | Created backend route to handle product creation with image data. | Multer, Buffer Handling | Completed |
| Day 5 | 8 | Admin Product UI | Built Admin "Add Product" form with Drag-and-Drop image zone. | File API, React DnD | Completed |
| Day 6 | 8 | Public Shop UI | Developed the main Shop page to list all available merchandise. | Grid Layouts, Flexbox | Completed |
| Day 7 | 8 | Shopping Cart Logic | Implemented local state/Context for Cart (Add, Remove, Quantity). | React Context API, LocalStorage | Completed |
| Day 8 | 8 | Order Schema & API | Designed Order schema and backend logic to save orders. | Database Relationships | Completed |
| Day 9 | 8 | Checkout Integration | Linked Cart to Razorpay payment flow (Shared Payment Controller). | Code Reusability, Modularization | Completed |
| Day 10| 8 | Admin Order View | Created Admin view to see and manage incoming merchandise orders. | Data Visualization, Status Updates | Completed |
| Day 11| 8 | UI/UX Polish | Refined Shop and Cart UI for mobile responsiveness and aesthetics. | CSS Media Queries, UX Best Practices | Completed |
| Day 12| 8 | Final System Test | Verified Product flow: Create -> Add to Cart -> Pay -> Order Log. | Integration Testing | Completed |
| **Total**| **80** | | | | |
