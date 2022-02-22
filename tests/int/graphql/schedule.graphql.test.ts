import request from '../api.int.helper';

jest.setTimeout(30000)


// Schedule
describe('POST /graphql/', () => {
    it('GraphQL: Schedule Query on COMPSCI 161',  () => request
    .post('/graphql/')
    .send({query:`{
        schedule(year: 2019, quarter: "Fall", department:"COMPSCI", course_number: "161") {
          title
          id
          offerings {
            year
            quarter
            instructors {
              ucinetid
              name
              department
            }
            final_exam
            max_capacity
            meetings {
              time
              building
              days
            }
            num_section_enrolled
            num_total_enrolled
            num_on_waitlist
            num_requested
            num_new_only_reserved
            units
            restrictions
            status
            course {
              title
              id
            }
          }
        }
      }`})
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .then((response) => {
        expect(response.body).toHaveProperty('data');
        expect(response.body["data"]).toHaveProperty('schedule');
        expect(Array.isArray(response.body["data"]["schedule"])).toBeTruthy();
        expect(response.body["data"]["schedule"][0]["title"]).toEqual("Design and Analysis of Algorithms");
        expect(response.body["data"]["schedule"][0]["id"]).toEqual("COMPSCI161");
        expect(Array.isArray(response.body["data"]["schedule"][0]["offerings"])).toBeTruthy();
        expect(response.body["data"]["schedule"][0]["offerings"][0]).toEqual(
          expect.objectContaining({
            "year": "2019",
            "quarter": "Fall",
            "instructors": expect.any(Array),
            "final_exam": expect.any(String),
            "max_capacity": expect.any(Number),
            "meetings": expect.any(Array),
            "num_section_enrolled": expect.any(Number),
            "num_total_enrolled": expect.any(Number),
            "num_on_waitlist": expect.any(Number),
            "num_requested": expect.any(Number),
            "num_new_only_reserved": expect.any(Number),
            "units": expect.any(Number),
            "restrictions": expect.any(String),
            "status": expect.any(String),
            "course": expect.any(Object)
          })
        );
    }));
  });

describe('POST /graphql/', () => {
    it('GraphQL: Schedule query on nonexistent course',  () => request
    .post('/graphql/')
    .send({query:`{
        schedule(year: 2019, quarter: "Fall", department:"COMPSCI", course_number: "100") {
            offerings {
                year
                max_capacity
                num_total_enrolled
            }
        }
        }`})
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .then((response) => {
        expect(response.body).toHaveProperty('data');
        expect(response.body["data"]).toHaveProperty('schedule');
        expect(response.body["data"]["schedule"].length).toEqual(0);
    }));
});

describe('POST /graphql/', () => {
  it('GraphQL: Schedule query on instructors with common names',  () => request
  .post('/graphql/')
  .send({query:`{
      schedule(year: 2022, quarter: "Spring", instructor: "SMITH, J.") {
          offerings {
            instructors {
              name
            }
          }
      }
      }`})
  .set('Accept', 'application/json')
  .expect('Content-Type', /json/)
  .expect(200)
  .then((response) => {
      expect(response.body).toHaveProperty('data');
      expect(response.body["data"]).toHaveProperty('schedule');
      expect(response.body["data"]["schedule"].length).toBeGreaterThan(0);
      expect(response.body)
      //check that all instructors are present.
      expect(response.body["data"]["schedule"]).toContainEqual(
        expect.objectContaining({
          "offerings": [
            {
              "instructors": [ { "name": "Jaymi Lee Smith" } ]
            }
          ]
        })
      );
      expect(response.body["data"]["schedule"]).toContainEqual(
        expect.objectContaining({
          "offerings": [
            {
              "instructors": [ { "name": "John H Smith" } ]
            }
          ]
        })
      );
      expect(response.body["data"]["schedule"]).toContainEqual(
        expect.objectContaining({
          "offerings": [
            {
              "instructors": [ { "name": "James N Smith" } ]
            }
          ]
        })
      );
  }));
});

describe('POST /graphql/', () => {
    it('GraphQL: Schedule query with invalid argument',  () => request
    .post('/graphql/')
    .send({query:`{
        schedule(year: 2019, quarter: 2019, department:"COMPSCI", course_number: "161") {
            offerings {
                year
                max_capacity
                num_total_enrolled
            }
        }
    }`})
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(400)
    .then((response) => {
        expect(response.body).toHaveProperty('errors');
        expect(response.body["errors"][0]["message"]).toMatch(/(2019)/i);
    }));
});




describe('POST /graphql/', () => {
  it('GraphQL: Schedule query with invalid argument',  () => request
  .post('/graphql/')
  .send({query:`{
      schedule(year: 2019, quarter: 2019, department:"COMPSCI", course_number: "161") {
          offerings {
              year
              max_capacity
              num_total_enrolled
          }
      }
  }`})
  .set('Accept', 'application/json')
  .expect('Content-Type', /json/)
  .expect(400)
  .then((response) => {
      expect(response.body).toHaveProperty('errors');
      expect(response.body["errors"][0]["message"]).toMatch(/(2019)/i);
  }));
});