import React, { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'

import { Form, Input, Button } from 'antd'

import { v4 as uuidv4 } from 'uuid'

import { ADD_BOAT, GET_BOAT } from '../../queries'

const AddBoat = () => {
  const [id] = useState(uuidv4())
  const [addBoat] = useMutation(ADD_BOAT)

  const [form] = Form.useForm()
  const [, forceUpdate] = useState()

  // To disable submit button at the beginning.
  useEffect(() => {
    forceUpdate({})
  }, [])

  const onFinish = values => {
    const { firstName, lastName } = values

    addBoat({
      variables: {
        id,
        year,
        make,
        model,
        price,
        personId
      },
      optimisticResponse: {
        __typename: 'Mutation',
        addBoat: {
          __typename: 'Boat',
          id,
          year,
          make,
          model,
          price,
          personId
        }
      },
      update: (proxy, { data: { addBoat } }) => {
        const data = proxy.readQuery({ query: GET_BOAT })
        proxy.writeQuery({
          query: GET_BOAT,
          data: {
            ...data,
            boats: [...data.boats, addBoat]
          }
        })
      }
    })
  }
  
  return (
    <Form
      form={form}
      name='add-boat-form'
      layout='inline'
      onFinish={onFinish}
      size='large'
      style={{ marginBottom: '40px' }}
    >
      <Form.Item
        name='year'
        rules={[{ required: true, message: 'Please input your boat year!' }]}
      >
        <Input placeholder='i.e. 2016' />
      </Form.Item>
      <Form.Item
        name='make'
        rules={[{ required: true, message: 'Please input your boat make!' }]}
      >
        <Input placeholder='i.e. Metal Shark' />
      </Form.Item>
      <Form.Item
        name='model'
        rules={[{ required: true, message: 'Please input your boat model!' }]}
      >
        <Input placeholder='i.e. Mount Fleet' />
      </Form.Item>
      
      <Form.Item
        name='price'
        rules={[{ required: true, message: 'Please input your boat price!' }]}
      >
        <Input placeholder='i.e. $100' />
      </Form.Item>

      <Form.Item shouldUpdate={true}>
        {() => (
          <Button
            type='primary'
            htmlType='submit'
            disabled={
              !form.isFieldsTouched(true) ||
              form.getFieldsError().filter(({ errors }) => errors.length).length
            }
          >
            Add Boat
          </Button>
        )}
      </Form.Item>
    </Form>
  )
}

export default AddBoat
