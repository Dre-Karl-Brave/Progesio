import KanbanBoard from '@/app/modules/dashboard/KanbanBoard'

export default async function BoardPage({ params }) {
  const { boardId } = await params

  return <KanbanBoard boardId={boardId} />
}
