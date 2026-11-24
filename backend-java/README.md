# FITVORA: Smart Fitness Management System
## Java Web-Based Project Architecture & Academic Marking Rubric Alignment

---

### Marking Rubric Mapping & Code Evidence

| Rubric Category | Marks | Concrete Code Evidence & Class Files | Description & Patterns Applied |
| :--- | :---: | :--- | :--- |
| **OOP Implementation** | **10** | `com.fitvora.model.AbstractWorkout`<br>`com.fitvora.model.StrengthWorkout`<br>`com.fitvora.model.CardioWorkout`<br>`com.fitvora.model.MobilityWorkout`<br>`com.fitvora.model.User`<br>`com.fitvora.model.AthleteUser`<br>`com.fitvora.model.TrainerUser`<br>`com.fitvora.interfaces.*`<br>`com.fitvora.exception.*` | **Polymorphism**: Dynamic method dispatch in `calculateCaloriesBurned(double weight)` with unique formulas for mechanical volume/EPOC vs VO2 max zones vs fascial decompression.<br>**Inheritance**: Hierarchical entity models `User -> Athlete, Trainer, Admin` and `AbstractWorkout -> Strength, Cardio, Mobility`.<br>**Interfaces**: `CalorieCalculable`, `Schedulable`, `Identifiable<ID>`, `Auditable`, `Authenticatable`, `Trackable`.<br>**Exception Handling**: Multi-tiered hierarchy (`FitvoraException` -> `DatabaseException`, `ValidationException`, `SchedulingConflictException`, `ConcurrencyConflictException`). |
| **Collections & Generics** | **6** | `com.fitvora.generics.GenericDao<T, ID>`<br>`com.fitvora.generics.PaginatedResult<T>`<br>`com.fitvora.generics.ApiResponse<T>`<br>`com.fitvora.generics.DataFilter<T>`<br>`com.fitvora.dao.BaseDao` | **Generics**: Type bounds `<T extends AbstractEntity, ID extends Serializable>` across generic DAOs.<br>**Collections**: `ArrayList`, `LinkedList` queues, `HashMap` metrics, `BlockingQueue` connection pool, and `ConcurrentHashMap` locks.<br>**Streams API**: Filtering, mapping, pagination, and transformations in `PaginatedResult.map()`. |
| **Multithreading & Synchronization** | **4** | `com.fitvora.concurrency.WorkoutAnalyticsProcessor`<br>`com.fitvora.concurrency.NotificationQueue`<br>`com.fitvora.concurrency.AppointmentSchedulerLock`<br>`com.fitvora.concurrency.WorkerThreadPoolManager`<br>`com.fitvora.db.ConnectionPool` | **ExecutorService & ThreadPool**: Fixed thread worker pool (`Executors.newFixedThreadPool(4)`) computing background metabolic summaries via `Callable` and `Future`.<br>**Locks & Conditions**: `ReentrantLock` with `Condition` (`notEmpty`, `notFull`) in `NotificationQueue`.<br>**Fine-Grained Locking**: `AppointmentSchedulerLock` using `ConcurrentHashMap<Long, ReentrantLock>` to eliminate double-booking race conditions.<br>**Atomic Primitives**: `AtomicLong` counters and volatile double-checked locking singleton in `ConnectionPool`. |
| **Classes for Database Operations** | **7** | `com.fitvora.dao.BaseDao`<br>`com.fitvora.dao.UserDaoImpl`<br>`com.fitvora.dao.WorkoutDaoImpl`<br>`com.fitvora.db.TransactionManager` | **DAO Pattern**: Clean separation of persistence and business logic.<br>**PreparedStatements**: Parameterized queries preventing SQL Injection.<br>**Batch Operations**: `ps.addBatch()` and `ps.executeBatch()` in `WorkoutDaoImpl.assignExercisesToWorkout()`.<br>**Transactions**: Programmatic ACID transactions (`setAutoCommit(false)`, `commit()`, `rollback()`) via `TransactionManager`. |
| **Database Connectivity (JDBC)** | **3 / 8** | `com.fitvora.db.DatabaseConnectionFactory`<br>`com.fitvora.db.ConnectionPool`<br>`com.fitvora.db.JdbcUtils`<br>`src/main/resources/schema.sql` | **Driver Loading**: `Class.forName("com.mysql.cj.jdbc.Driver")`.<br>**Connection Pooling**: Thread-safe pool checkout/checkin with timeout handling.<br>**Relational Schema**: Full MySQL DDL with foreign keys, cascading constraints, unique keys, and composite indexes. |
| **Servlets & Web Integration** | **7** | `com.fitvora.servlet.UserServlet`<br>`com.fitvora.servlet.WorkoutServlet`<br>`com.fitvora.servlet.AppointmentServlet`<br>`com.fitvora.servlet.AuthenticationFilter`<br>`src/main/webapp/WEB-INF/web.xml` | **HttpServlet**: RESTful endpoints handling `doGet`, `doPost`, `doPut`, `doDelete`.<br>**Servlet Filters**: Cross-cutting `AuthenticationFilter` managing CORS and session tokens.<br>**JSON Serialization**: Jackson ObjectMapper for Java Time (`LocalDateTime`) and generics response envelope. |
| **Problem Understanding & Solution Design** | **8** | Entire layered system architecture | Layered enterprise architecture: Presentation -> Service -> Concurrency -> DAO -> JDBC -> MySQL. |
| **Core Java Concepts** | **10** | `com.fitvora.enums.*`<br>`com.fitvora.model.*` | Enums with state/methods, encapsulation, java.time API, immutability, static vs instance scope. |

---

### How to Build & Run with Maven:

```bash
# 1. Compile and package the Java WAR application
mvn clean package

# 2. Deploy fitvora.war to Apache Tomcat 9/10 or Jetty
cp target/fitvora.war $CATALINA_HOME/webapps/

# 3. Setup MySQL Database
mysql -u root -p < src/main/resources/schema.sql
```
