import { ITask } from '@/app'
import { theme } from '@/constants/Colors'
import { AntDesign } from '@expo/vector-icons'
import {
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import { Dispatch, SetStateAction, useCallback, useRef, useState } from 'react'
import { Alert, StyleSheet, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

type CreateTaskSheetProps = {
  setTasks: Dispatch<SetStateAction<ITask[]>>
}

export function CreateTaskSheet({ setTasks }: CreateTaskSheetProps) {
  const bottomSheetRef = useRef<BottomSheetModal>(null)
  const handleOpenSheet = useCallback(() => {
    bottomSheetRef.current?.present()
  }, [])

  const [name, setName] = useState('')
  const [date, setDate] = useState('')

  function handleCreateTask() {
    if (!name || !date) {
      return Alert.alert('Preencha os campos!')
    }

    const [day, month, year] = date.split('/').map(Number)
    const formattedDate = new Date(year, month - 1, day)

    setTasks((prev) => [
      ...prev,
      {
        id: String(prev[prev.length - 1].id + 1),
        date: formattedDate,
        name,
        completed: false,
      },
    ])

    bottomSheetRef.current?.close()
    setDate('')
    setName('')
  }

  return (
    <>
      <TouchableOpacity onPress={handleOpenSheet}>
        <AntDesign name="pluscircle" size={26} color="white" />
      </TouchableOpacity>

      <BottomSheetModal
        ref={bottomSheetRef}
        index={1}
        snapPoints={[1]}
        enableDynamicSizing
        enableOverDrag
      >
        <BottomSheetView
          style={{
            padding: 24,
            paddingBottom: 40,
            gap: 24,
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Text style={styles.title}>Crie sua tarefa</Text>

          <View style={styles.inputs}>
            <BottomSheetTextInput
              placeholder="Nome da Atividade"
              placeholderTextColor={theme.gray}
              style={styles.input}
              value={name}
              onChangeText={setName}
            />
            <BottomSheetTextInput
              placeholder="05/08/2024"
              placeholderTextColor={theme.gray}
              style={styles.input}
              value={date}
              keyboardType="numbers-and-punctuation"
              onChangeText={setDate}
            />
          </View>

          <TouchableOpacity
            onPress={handleCreateTask}
            activeOpacity={0.7}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Criar</Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  )
}

const styles = StyleSheet.create({
  title: {
    color: 'black',
    fontSize: 32,
    fontWeight: 'bold',
  },
  inputs: {
    gap: 16,
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: theme.gray,
    width: '100%',
    padding: 16,
    borderRadius: 8,
  },
  button: {
    backgroundColor: theme.primary,
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
})
