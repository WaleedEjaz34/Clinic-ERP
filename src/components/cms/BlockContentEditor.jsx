import React from 'react';
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Heading,
  AlignLeft,
  Image as ImageIcon,
  List,
  Sparkles,
  Info,
  Minus,
} from 'lucide-react';
import { useWebsiteCMS } from '../../context/WebsiteCMSContext';

export const BlockContentEditor = ({ blocks = [], onChange }) => {
  const { openMediaPicker } = useWebsiteCMS();

  const handleAddBlock = (type) => {
    const newBlock = {
      id: `blk-${Date.now()}`,
      type,
    };

    if (type === 'heading') {
      newBlock.level = 2;
      newBlock.content = 'New Section Heading';
    } else if (type === 'paragraph') {
      newBlock.content = 'Enter comprehensive paragraph text here.';
    } else if (type === 'image') {
      newBlock.url = 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80';
      newBlock.altText = 'Clinical facility photo';
      newBlock.caption = '';
    } else if (type === 'bulletList') {
      newBlock.items = ['First key highlight or clinical point', 'Second clinical feature', 'Third patient benefit'];
    } else if (type === 'cta') {
      newBlock.heading = 'Ready to Consult Our Specialists?';
      newBlock.buttonText = 'Book an Appointment';
      newBlock.buttonLink = '/website-preview?page=book-appointment';
    } else if (type === 'infoCard') {
      newBlock.title = 'Clinical Advisory';
      newBlock.content = 'Important patient instruction or clinical notice.';
    } else if (type === 'divider') {
      // No extra fields needed
    }

    onChange([...blocks, newBlock]);
  };

  const handleUpdateBlock = (blockId, updates) => {
    onChange(blocks.map((b) => (b.id === blockId ? { ...b, ...updates } : b)));
  };

  const handleDeleteBlock = (blockId) => {
    onChange(blocks.filter((b) => b.id !== blockId));
  };

  const handleMoveBlock = (index, direction) => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === blocks.length - 1) return;
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const updated = [...blocks];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-700">
          Page Content Blocks ({blocks.length})
        </label>
        <span className="text-[11px] text-slate-400">
          Add modular structured blocks for clean public rendering
        </span>
      </div>

      {/* Render existing blocks */}
      <div className="space-y-3">
        {blocks.map((block, index) => (
          <div
            key={block.id}
            className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5 relative group hover:border-slate-300 transition-colors"
          >
            {/* Block Top Controls */}
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200/80">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                {block.type === 'heading' && <Heading className="w-3.5 h-3.5 text-brand-600" />}
                {block.type === 'paragraph' && <AlignLeft className="w-3.5 h-3.5 text-blue-600" />}
                {block.type === 'image' && <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />}
                {block.type === 'bulletList' && <List className="w-3.5 h-3.5 text-amber-600" />}
                {block.type === 'cta' && <Sparkles className="w-3.5 h-3.5 text-purple-600" />}
                {block.type === 'infoCard' && <Info className="w-3.5 h-3.5 text-indigo-600" />}
                {block.type === 'divider' && <Minus className="w-3.5 h-3.5 text-slate-400" />}
                <span>{block.type} Block</span>
              </span>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleMoveBlock(index, 'up')}
                  disabled={index === 0}
                  className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded cursor-pointer"
                  title="Move Up"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleMoveBlock(index, 'down')}
                  disabled={index === blocks.length - 1}
                  className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded cursor-pointer"
                  title="Move Down"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteBlock(block.id)}
                  className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded cursor-pointer ml-1"
                  title="Delete Block"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Block Content Inputs */}
            {block.type === 'heading' && (
              <div className="flex gap-2">
                <select
                  value={block.level || 2}
                  onChange={(e) => handleUpdateBlock(block.id, { level: Number(e.target.value) })}
                  className="bg-white border border-slate-200 text-xs rounded-lg px-2.5 py-1.5 font-bold"
                >
                  <option value={1}>H1</option>
                  <option value={2}>H2</option>
                  <option value={3}>H3</option>
                </select>
                <input
                  type="text"
                  value={block.content || ''}
                  onChange={(e) => handleUpdateBlock(block.id, { content: e.target.value })}
                  placeholder="Heading text..."
                  className="flex-1 bg-white border border-slate-200 text-xs font-bold rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
            )}

            {block.type === 'paragraph' && (
              <textarea
                value={block.content || ''}
                onChange={(e) => handleUpdateBlock(block.id, { content: e.target.value })}
                rows={3}
                placeholder="Enter paragraph text..."
                className="w-full bg-white border border-slate-200 text-xs rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            )}

            {block.type === 'image' && (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={block.url || ''}
                    onChange={(e) => handleUpdateBlock(block.id, { url: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 bg-white border border-slate-200 text-xs rounded-lg px-3 py-1.5"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      openMediaPicker((selectedUrl) => {
                        handleUpdateBlock(block.id, { url: selectedUrl });
                      })
                    }
                    className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer hover:bg-slate-800"
                  >
                    Pick from Media
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={block.altText || ''}
                    onChange={(e) => handleUpdateBlock(block.id, { altText: e.target.value })}
                    placeholder="Alt text description..."
                    className="bg-white border border-slate-200 text-xs rounded-lg px-2.5 py-1"
                  />
                  <input
                    type="text"
                    value={block.caption || ''}
                    onChange={(e) => handleUpdateBlock(block.id, { caption: e.target.value })}
                    placeholder="Optional image caption..."
                    className="bg-white border border-slate-200 text-xs rounded-lg px-2.5 py-1"
                  />
                </div>
                {block.url && (
                  <img
                    src={block.url}
                    alt={block.altText || 'Preview'}
                    className="h-24 w-auto rounded-lg object-cover border border-slate-200"
                  />
                )}
              </div>
            )}

            {block.type === 'bulletList' && (
              <div className="space-y-1.5">
                {(block.items || []).map((item, itemIdx) => (
                  <div key={itemIdx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0" />
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => {
                        const newItems = [...(block.items || [])];
                        newItems[itemIdx] = e.target.value;
                        handleUpdateBlock(block.id, { items: newItems });
                      }}
                      className="flex-1 bg-white border border-slate-200 text-xs rounded-lg px-2.5 py-1"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newItems = (block.items || []).filter((_, i) => i !== itemIdx);
                        handleUpdateBlock(block.id, { items: newItems });
                      }}
                      className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    handleUpdateBlock(block.id, {
                      items: [...(block.items || []), 'New bullet point item'],
                    })
                  }
                  className="text-[11px] text-brand-600 font-bold hover:underline flex items-center gap-1 cursor-pointer pt-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add List Item</span>
                </button>
              </div>
            )}

            {block.type === 'cta' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  value={block.heading || ''}
                  onChange={(e) => handleUpdateBlock(block.id, { heading: e.target.value })}
                  placeholder="CTA Heading..."
                  className="bg-white border border-slate-200 text-xs rounded-lg px-2.5 py-1.5"
                />
                <input
                  type="text"
                  value={block.buttonText || ''}
                  onChange={(e) => handleUpdateBlock(block.id, { buttonText: e.target.value })}
                  placeholder="Button Label..."
                  className="bg-white border border-slate-200 text-xs rounded-lg px-2.5 py-1.5"
                />
                <input
                  type="text"
                  value={block.buttonLink || ''}
                  onChange={(e) => handleUpdateBlock(block.id, { buttonLink: e.target.value })}
                  placeholder="Destination URL/Slug..."
                  className="bg-white border border-slate-200 text-xs rounded-lg px-2.5 py-1.5"
                />
              </div>
            )}

            {block.type === 'infoCard' && (
              <div className="space-y-2">
                <input
                  type="text"
                  value={block.title || ''}
                  onChange={(e) => handleUpdateBlock(block.id, { title: e.target.value })}
                  placeholder="Card Title (e.g. Clinical Advisory)..."
                  className="w-full bg-white border border-slate-200 text-xs font-bold rounded-lg px-2.5 py-1.5"
                />
                <textarea
                  value={block.content || ''}
                  onChange={(e) => handleUpdateBlock(block.id, { content: e.target.value })}
                  rows={2}
                  placeholder="Information text..."
                  className="w-full bg-white border border-slate-200 text-xs rounded-lg p-2"
                />
              </div>
            )}

            {block.type === 'divider' && (
              <div className="py-1">
                <hr className="border-t-2 border-dashed border-slate-300" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add New Block Toolbar */}
      <div className="pt-2">
        <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1.5 tracking-wider">
          Insert New Content Block
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => handleAddBlock('heading')}
            className="px-2.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Heading className="w-3.5 h-3.5 text-brand-600" />
            <span>Heading</span>
          </button>
          <button
            type="button"
            onClick={() => handleAddBlock('paragraph')}
            className="px-2.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <AlignLeft className="w-3.5 h-3.5 text-blue-600" />
            <span>Paragraph</span>
          </button>
          <button
            type="button"
            onClick={() => handleAddBlock('image')}
            className="px-2.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
            <span>Image</span>
          </button>
          <button
            type="button"
            onClick={() => handleAddBlock('bulletList')}
            className="px-2.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <List className="w-3.5 h-3.5 text-amber-600" />
            <span>Bullet List</span>
          </button>
          <button
            type="button"
            onClick={() => handleAddBlock('cta')}
            className="px-2.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Call to Action</span>
          </button>
          <button
            type="button"
            onClick={() => handleAddBlock('infoCard')}
            className="px-2.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Info className="w-3.5 h-3.5 text-indigo-600" />
            <span>Info Card</span>
          </button>
          <button
            type="button"
            onClick={() => handleAddBlock('divider')}
            className="px-2.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Minus className="w-3.5 h-3.5 text-slate-400" />
            <span>Divider</span>
          </button>
        </div>
      </div>
    </div>
  );
};
