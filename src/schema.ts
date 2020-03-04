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
    updateMe(user:MeInput): User
    authenticate(email:String, password:String): String
    deauthenticate: Boolean
    createQuestionnaire(title:String, questions: [QuestionInput]): Questionnaire
    addQuestions(questions: [QuestionInput]): [Question]
    createQuestionRelations(relations: [QuestionRelationInput]): Boolean
    submitBooleanQuestionResponse(questionId: Int!, value: Boolean!): Boolean
    submitTextQuestionResponse(questionId: Int!, value: String!): Boolean
    submitChoiceQuestionResponse(questionId: Int!, value: String!): Boolean
  }

  ### User

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

  input MeInput {
    name: String
    email: String
    role: Role
    imageUrl: String
    birthday: Int
  }

  ### Questionnaire

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
    type: QuestionType!
    response: String
    next: [QuestionRelation]
  }

  type MultipleChoiceQuestion implements QuestionMeta {
    id: Int
    questionnaire: Questionnaire
    text: String

    "This will always be 'MULTIPLE_CHOICE'"
    type: QuestionType!
    options: [QuestionOption]!

    "Collection of QuestionOption values"
    response: [String]
    next: [QuestionRelation]
  }

  type SingleChoiceQuestion implements QuestionMeta {
    id: Int
    questionnaire: Questionnaire
    text: String

    "This will always be 'SINGLE_CHOICE'"
    type: QuestionType!
    options: [QuestionOption]!

    "A single QuestionOption value"
    response: String
    next: [QuestionRelation]
  }

  type BooleanQuestion implements QuestionMeta {
    id: Int
    questionnaire: Questionnaire
    text: String

    "This will always be 'BOOLEAN'"
    type: QuestionType!
    response: Boolean
    next: [QuestionRelation]
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

  input QuestionInput {
    text: String!
    type: QuestionType!
    options: [QuestionOptionInput]

    "Only required when creating a question for an already existing questionnaire"
    questionnaireId: Int
  }

  type QuestionOption {
    value: String
    text: String
  }

  input QuestionOptionInput {
    value: String
    text: String
  }

  type QuestionRelation {
    includes: String
    equals: String
    nextQuestionId: Int
  }

  input QuestionRelationInput {
    questionId: Int
    nextQuestionId: Int
    includes: String
    equals: String
  }

  interface QuestionMeta {
    id: Int
    questionnaire: Questionnaire

    "The question text the user sees"
    text: String
    type: QuestionType
    next: [QuestionRelation]
  }

`
