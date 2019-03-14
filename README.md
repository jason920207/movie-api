# moCtoDnozamA API

This is the backend API for Movie website we created. The database uses MongoDB and features three key models to hold our data: the user, comment, movie.

## TECHNOLOGIES IN USE

- REACT.js
- Express.js
- Node.js
- AWS
- MongoDB
- Mongoose
- AXIOS
- CSS/Bootstrap
- AWS

## PLANNING & DEVELOPMENT

We made initial wireframes and an ERD for our prompt. We tried several different approaches when creating our API. The first attempt, we found that we had a lot of nested data that was difficult to mentally parse, and decided to scrap the whole idea and create four models reflecting each part of our website. It taught us a lot about what /not/ to do, which in turn allowed us to learn from our mistakes and ultimately improve our skeletal design.

### Routes

Although `comments` require a token, comments on a specific blog can be viewed when all blogs are indexed due to the execution of a `populate()` within blogs which allows us to view those specific comments. This essentially gives any user on the website the ability to view all comments just as they do with blogs.

| Verb   | URI Pattern        | Request Body      | Headers   | Action              |
|--------|--------------------|-------------------|-----------|---------------------|
| POST   | `/sign-up`         | **credentials**   | N/A       | user sign-up        |
| POST   | `/sign-in`         | **credentials**   | N/A       | user sign-in        |
| DELETE | `/sign-out`        | N/A               | **Token** | user sign-out       |
| PATCH  | `/change-password` | **passwords**     | **Token** | change-password     |
|        |                    |                   |           |                     |
| GET    | `/movies`           | N/A               | N/A       | index movies         |
| GET    | `/moviesbystar`      | N/A               | N/A  | index user blogs    |
| GET    | `/movies/:id`       | N/A               | N/A  | show single movie    |
| POST   | `/movies`           | `movie: {}`        | **Admin** | create movie         |
| PATCH  | `/movies/:id`       | **movie data**    | **Admin** | update movie         |
| DELETE | `/movies/:id`       | N/A               | **Admin** | remove movie         |
|        |                    |                   |           |                     |
| GET    | `/comments`        | N/A               | **Token** | index blog comments |
| GET    | `/comments/:id`    | N/A               | **Token** | show blog comment   |
| POST   | `/comments`        | `comment: {}`     | **Token** | create blog comment |
| PATCH  | `/comments/:id`    | **comment delta** | **Token** | update blog comment |
| DELETE | `/comments/:id`    | N/A               | **Token** | delete blog comment |


[Link to Wireframes](https://imgur.com/hqmz1jf)

[Link to ERD](https://imgur.com/Pbmfyq0)

## UNSOLVED PROBLEMS

UX design should be cleaner.
Making code more DRY.

## LINKS
[Back End Repo](https://github.com/jason920207/movie-api)

[Front End Repo](https://github.com/jason920207/movie-react)

[Deployed Front End](https://jason920207.github.io/movie-react/)

[Deployed Heroku](https://evening-ocean-81784.herokuapp.com)
