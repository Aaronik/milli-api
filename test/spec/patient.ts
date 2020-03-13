import { gql } from 'apollo-server'
import createTestClient from 'test/create-test-client'
import { TestModuleExport } from 'test/runner'
import * as T from 'types'

const DOCTORS = gql`
  query Doctors {
    doctors {
      id
    }
  }
`

const PATIENTS = gql`
  query Patients {
    patients {
      id
    }
  }
`

const ASSIGN_PATIENT_TO_DOCTOR = gql`
  mutation AssignPatientToDoctor($patientId: Int!, $doctorId: Int!) {
    assignPatientToDoctor(patientId: $patientId, doctorId: $doctorId)
  }
`

const UNASSIGN_PATIENT_FROM_DOCTOR = gql`
  mutation UnassignPatientFromDoctor($patientId: Int!, $doctorId: Int!) {
    unassignPatientFromDoctor(patientId: $patientId, doctorId: $doctorId)
  }
`

const ME = gql`
  query {
    me {
      id
    }
  }
`

export const test: TestModuleExport = (test, query, mutate, knex, db, server) => {

  test('GQL Doctor Patient Relationships -- created, destroyed', async t => {
    await db._util.clearDb()

    // setup
    const { data: { me: { id: doctorId }}} = await query(server).asDoctor({ query: ME })
    const { data: { me: { id: patientId }}} = await query(server).asPatient({ query: ME })
    const { errors: assignErrors } = await mutate(server).asDoctor({ mutation: ASSIGN_PATIENT_TO_DOCTOR, variables: { patientId, doctorId }})
    t.equal(assignErrors, undefined)

    {
      // testing creation
      const { data: { patients }} = await query(server).asDoctor({ query: PATIENTS })
      t.equal(patients[0].id, patientId)

      const { data: { doctors }} = await query(server).asPatient({ query: DOCTORS })
      t.equal(doctors[0].id, doctorId)
    }

    // destroy
    const { errors: destroyErrors } = await mutate(server).asDoctor({ mutation: UNASSIGN_PATIENT_FROM_DOCTOR, variables: { patientId, doctorId }})
    t.equal(destroyErrors, undefined)

    {
      // Testing destroy
      const { data: { patients }} = await query(server).asDoctor({ query: PATIENTS })
      t.deepEqual(patients, [])

      const { data: { doctors }} = await query(server).asPatient({ query: DOCTORS })
      t.deepEqual(doctors, [])
    }
    t.end()
  })

}

