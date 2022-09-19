import React, { useEffect, useRef, useState } from 'react'
import { FlatList } from 'react-native'
import BottomSheet from '@gorhom/bottom-sheet'
import { Q } from '@nozbe/watermelondb'
import { database } from '../../databases'
import { SkillModel } from '../../databases/models/skillModel'

import { Menu, MenuTypeProps } from '../../components/Menu'
import { Skill } from '../../components/Skill'
import { Button } from '../../components/Button'

import { Container, Title, Input, Form, FormTitle } from './styles'

export function Home() {
  const [type, setType] = useState<MenuTypeProps>('soft')
  const [name, setName] = useState('')
  const [skills, setSkills] = useState<SkillModel[]>([])
  const [skillToEdit, setSkillToEdit] = useState({} as SkillModel)

  const bottomSheetRef = useRef<BottomSheet>(null)

  const fetchData = async () => {
    const skillCollection = database.get<SkillModel>('skills')
    const response = await skillCollection.query(Q.where('type', type)).fetch()

    setSkills(response)
  }

  const handleSaveOrEdit = async (item?: SkillModel) => {
    if (skillToEdit.id) {
      database.write(async () => {
        item?.update(data => (data.name = name))
      })
      fetchData()
      setSkillToEdit({} as SkillModel)
      setName('')
      bottomSheetRef.current?.collapse()
      return
    }

    await database.write(async () => {
      await database.get<SkillModel>('skills').create(data => {
        ;(data.name = name), (data.type = type)
      })
    })

    bottomSheetRef.current?.collapse()
    fetchData()
    setName('')
  }

  const handleEdit = async (item: SkillModel) => {
    setSkillToEdit(item)
    setName(item.name)
    bottomSheetRef.current?.expand()
  }

  const handleDelete = async (item: SkillModel) => {
    await database.write(async () => {
      await item.destroyPermanently()
    })
    fetchData()
  }

  useEffect(() => {
    fetchData()
  }, [type])

  return (
    <Container>
      <Title>About me</Title>
      <Menu type={type} setType={setType} />

      <FlatList
        data={skills}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Skill
            data={item}
            onEdit={() => handleEdit(item)}
            onRemove={() => handleDelete(item)}
          />
        )}
      />

      <BottomSheet ref={bottomSheetRef} index={0} snapPoints={['1%', '35%']}>
        <Form>
          <FormTitle>New</FormTitle>

          <Input
            placeholder="New skill..."
            onChangeText={setName}
            value={name}
          />

          <Button title="Save" onPress={() => handleSaveOrEdit(skillToEdit)} />
        </Form>
      </BottomSheet>
    </Container>
  )
}
