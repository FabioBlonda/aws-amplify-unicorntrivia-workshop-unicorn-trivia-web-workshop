/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateQuestion = /* GraphQL */ `
  subscription OnCreateQuestion($filter: ModelSubscriptionQuestionFilterInput) {
    onCreateQuestion(filter: $filter) {
      id
      question
      answers
      answerId
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateQuestion = /* GraphQL */ `
  subscription OnUpdateQuestion($filter: ModelSubscriptionQuestionFilterInput) {
    onUpdateQuestion(filter: $filter) {
      id
      question
      answers
      answerId
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteQuestion = /* GraphQL */ `
  subscription OnDeleteQuestion($filter: ModelSubscriptionQuestionFilterInput) {
    onDeleteQuestion(filter: $filter) {
      id
      question
      answers
      answerId
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateAnswer = /* GraphQL */ `
  subscription OnCreateAnswer($filter: ModelSubscriptionAnswerFilterInput) {
    onCreateAnswer(filter: $filter) {
      id
      username
      answer
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateAnswer = /* GraphQL */ `
  subscription OnUpdateAnswer($filter: ModelSubscriptionAnswerFilterInput) {
    onUpdateAnswer(filter: $filter) {
      id
      username
      answer
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteAnswer = /* GraphQL */ `
  subscription OnDeleteAnswer($filter: ModelSubscriptionAnswerFilterInput) {
    onDeleteAnswer(filter: $filter) {
      id
      username
      answer
      createdAt
      updatedAt
      __typename
    }
  }
`;
