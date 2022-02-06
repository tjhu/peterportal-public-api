const path = require('path');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList
  } = require('graphql');

const {courseType} = require('./course.js')
const {getInstructor} =  require('../helpers/instructor.helper')
const { loadFiles } = require('@graphql-tools/load-files')

const loadedFiles = loadFiles(path.join(__dirname, 'course.js'), { extensions: ['js']})
loadedFiles.then((res) =>{
  console.log(res)
})
const instructorType = new GraphQLObjectType({
    name: 'Instructor',
    fields: () => ({
      name: { type: GraphQLString },
      shortened_name: { 
        type: GraphQLString, 
        description: "Name as it appears on webreg. Follows the format: `DOE, J.`",
        resolve: (instructor) => {
          if (instructor.shortened_name) {
            return instructor.shortened_name
          } else {
            // If the shortened_name wasn't provided, 
            // we can construct it from the name.
            const name_parts = instructor.name.split(' ');
            return `${name_parts[name_parts.length-1]}, ${name_parts[0][0]}.`.toUpperCase()
          }
        }
      },
      ucinetid: { type: GraphQLString },
      email: {type: GraphQLString },
      title: { type: GraphQLString },
      department: { type: GraphQLString },
      schools: { type: GraphQLList(GraphQLString) },
      related_departments: { type: GraphQLList(GraphQLString) },
      course_history: { 
        type: GraphQLList(courseType),
        resolve: (instructor) => {
          return getInstructor(instructor.ucinetid)["course_history"].map(course_id => getCourse(course_id.replace(/ /g, "")));
        }
      }
    })
  });
  module.exports = {instructorType}