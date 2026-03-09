import KanbanBoard from '@/app/modules/dashboard/KanbanBoard'

export async function generateMetadata({ params }) {
  const { boardId } = await params

  // Fetch board name for dynamic title
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/boards/${boardId}`)
    if (response.ok) {
      const data = await response.json()
      return {
        title: data.board.name
      }
    }
  } catch (error) {
    // Fallback to generic title if fetch fails
  }

  return {
    title: 'Board'
  }
}

export default async function BoardPage({ params }) {
  const { boardId } = await params

  return <KanbanBoard boardId={boardId} />
}
