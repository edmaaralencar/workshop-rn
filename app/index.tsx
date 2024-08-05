import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { useState } from 'react'
import { Pressable, SectionList, StyleSheet, Text, View } from 'react-native'
import { AntDesign, FontAwesome } from '@expo/vector-icons'

import { CreateTaskSheet } from '@/components/CreateTaskSheet'
import { theme } from '@/constants/Colors'

export interface ITask {
  id: string
  name: string
  date: Date
  completed: boolean
}

interface IGroupedTask {
  title: string
  data: ITask[]
}

export default function Index() {
  const [tasks, setTasks] = useState<ITask[]>([
    {
      completed: false,
      id: '1',
      name: 'Task 1',
      date: new Date(),
    },
  ])

  const groupedTasksByDate = tasks.reduce(
    (acc: IGroupedTask[], task: ITask) => {
      const date = task.date.toLocaleString().split(', ')[0]

      const dateExists = acc.findIndex((item) => item.title === date)

      if (dateExists > -1) {
        acc[dateExists].data.push(task)
      } else {
        acc.push({
          title: date,
          data: [task],
        })
      }

      return acc
    },
    []
  )

  function formatTitleValue(date: string) {
    const today = new Date().toLocaleString().split(', ')[0]

    if (date === today) {
      return 'Hoje'
    }

    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    if (date === yesterday.toLocaleString().split(', ')[0]) {
      return 'Ontem'
    }

    return date
  }

  function handleCompleteTask(taskId: string) {
    setTasks((prev) =>
      prev.map((item) =>
        item.id === taskId
          ? {
              ...item,
              completed: !item.completed,
            }
          : item
      )
    )
  }

  function handleDeleteTask(taskId: string) {
    setTasks((prev) => prev.filter((item) => item.id !== taskId))
  }

  return (
    <BottomSheetModalProvider>
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>To-Do List</Text>

          <CreateTaskSheet setTasks={setTasks} />
        </View>

        <SectionList
          sections={groupedTasksByDate}
          contentContainerStyle={styles.sectionList}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={() => (
            <View>
              <Text style={styles.emptyList}>Crie uma tarefa</Text>
            </View>
          )}
          renderSectionHeader={(item) => (
            <Text style={styles.sectionTitle}>
              {formatTitleValue(item.section.title)}
            </Text>
          )}
          renderItem={({ item }) => (
            <View style={styles.task}>
              <Text
                style={{
                  textDecorationLine: item.completed ? 'line-through' : 'none',
                }}
              >
                {item.name}
              </Text>

              <View style={styles.buttonWrapper}>
                <Pressable onPress={() => handleCompleteTask(item.id)}>
                  <AntDesign
                    name={item.completed ? 'checkcircle' : 'checkcircleo'}
                    color={theme.primary}
                    size={22}
                  />
                </Pressable>
                <Pressable onPress={() => handleDeleteTask(item.id)}>
                  <FontAwesome name="trash" color={theme.primary} size={22} />
                </Pressable>
              </View>
            </View>
          )}
        />
      </View>
    </BottomSheetModalProvider>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  header: {
    backgroundColor: theme.primary,
    height: 110,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: 16,
    flexDirection: 'row',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  sectionList: {
    paddingHorizontal: 16,
    paddingVertical: 32,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  task: {
    backgroundColor: theme.lightGray,
    padding: 16,
    borderLeftWidth: 3,
    borderLeftColor: theme.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emptyList: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonWrapper: { gap: 16, flexDirection: 'row' },
})
