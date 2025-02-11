
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';

const initialNodes = [
  {
    id: 'input',
    type: 'input',
    data: { label: 'URL Input' },
    position: { x: 250, y: 0 },
    style: { backgroundColor: '#f3f4f6', padding: '10px' }
  },
  {
    id: 'code-fetch',
    data: { label: 'Code: Fetch HTML' },
    position: { x: 100, y: 100 },
    style: { backgroundColor: '#dbeafe', padding: '10px' }
  },
  {
    id: 'ai-fetch',
    data: { label: 'AI: Fetch & Process' },
    position: { x: 400, y: 100 },
    style: { backgroundColor: '#86C232', padding: '10px', color: 'white' }
  },
  {
    id: 'code-extract',
    data: { label: 'Code: Extract Content' },
    position: { x: 100, y: 200 },
    style: { backgroundColor: '#dcfce7', padding: '10px' }
  },
  {
    id: 'code-clean',
    type: 'output',
    data: { label: 'Code: Clean & Format' },
    position: { x: 100, y: 300 },
    style: { backgroundColor: '#fef3c7', padding: '10px' }
  },
  {
    id: 'ai-output',
    type: 'output',
    data: { label: 'AI: Generated Content' },
    position: { x: 400, y: 300 },
    style: { backgroundColor: '#61892F', padding: '10px', color: 'white' }
  }
];

const initialEdges = [
  // Code-based path
  { id: 'e1-1', source: 'input', target: 'code-fetch', animated: true },
  { id: 'e1-2', source: 'code-fetch', target: 'code-extract', animated: true },
  { id: 'e1-3', source: 'code-extract', target: 'code-clean', animated: true },
  
  // AI-based path
  { id: 'e2-1', source: 'input', target: 'ai-fetch', animated: true },
  { id: 'e2-2', source: 'ai-fetch', target: 'ai-output', animated: true }
];

export const ArticleExtractorDiagram = () => {
  const [nodes] = useNodesState(initialNodes);
  const [edges] = useEdgesState(initialEdges);

  return (
    <div style={{ width: '100%', height: '400px' }} className="bg-white rounded-lg shadow-sm">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        attributionPosition="bottom-right"
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};
