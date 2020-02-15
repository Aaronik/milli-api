import { gql } from 'apollo-server'

export default gql`

  type Query {
    me: User
    user(id: Int!): User
    users: [User]
    questionnaire(id: Int!): Questionnaire
    question(id: Int!): Question
  }

  type Mutation {
    createUser(email:String, password:String, role:Role): User
    authenticate(email:String, password:String): String
    deauthenticate: Boolean
    submitQuestionResponse: Boolean
    createQuestionnaire(title:String, questions: [QuestionInput]): Questionnaire
  }

  type User {
    id: Int
    name: String
    email: String
    role: Role
    joinDate: String
    lastVisit: String
    adherence: Int
    imageUrl: String
    birthday: Int
  }

  enum Role {
    ADMIN,
    DOCTOR,
    PATIENT
  }

  type Questionnaire {
    id: Int
    title: String
    questions: [Question]
  }

  union Question =
      TextQuestion
    | MultipleChoiceQuestion
    | SingleChoiceQuestion
    | BooleanQuestion

  type TextQuestion implements QuestionMeta {
    id: Int
    questionnaire: Questionnaire
    text: String

    "This will always be 'TEXT'"
    type: QuestionType
    response: String
  }

  type QuestionOption {
    value: String
    text: String
  }

  type MultipleChoiceQuestion implements QuestionMeta {
    id: Int
    questionnaire: Questionnaire
    text: String

    "This will always be 'MULTIPLE_CHOICE'"
    type: QuestionType
    options: [QuestionOption]

    "Collection of QuestionOption values"
    response: [String]
  }

  type SingleChoiceQuestion implements QuestionMeta {
    id: Int
    questionnaire: Questionnaire
    text: String

    "This will always be 'SINGLE_CHOICE'"
    type: QuestionType
    options: [QuestionOption]

    "A single QuestionOption value"
    response: String
  }

  type BooleanQuestion implements QuestionMeta {
    id: Int
    questionnaire: Questionnaire
    text: String

    "This will always be 'BOOLEAN'"
    type: QuestionType
    response: Boolean
  }

  enum QuestionType {
    "Single Input"
    TEXT

    "Checkbox Ex 'Select all that apply..'"
    MULTIPLE_CHOICE

    "Radiogroup Ex 'Choose the best answer..'"
    SINGLE_CHOICE

    "Boolean"
    BOOLEAN
  }

  interface QuestionMeta {
    id: Int
    questionnaire: Questionnaire

    "The question text the user sees"
    text: String
    type: QuestionType
  }

  input QuestionInput {
    text: String
    type: QuestionType
    options: [QuestionOptionInput]
  }

  input QuestionOptionInput {
    value: String
    text: String
  }

`
