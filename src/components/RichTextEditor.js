import React, { useState } from "react";
import { Editor, EditorState, RichUtils } from "draft-js";
import "draft-js/dist/Draft.css";

const RichTextEditor = ({ value, onChange }) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return "handled";
    }
    return "not-handled";
  };

  const onBoldClick = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, "BOLD"));
  };

  const onItalicClick = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, "ITALIC"));
  };

  const onUnderlineClick = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, "UNDERLINE"));
  };

  return (
    <div className="border rounded-lg p-4">
      <div className="mb-3 pb-2 border-b flex gap-2">
        <button
          type="button"
          onClick={onBoldClick}
          className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
        >
          B
        </button>
        <button
          type="button"
          onClick={onItalicClick}
          className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
        >
          I
        </button>
        <button
          type="button"
          onClick={onUnderlineClick}
          className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
        >
          U
        </button>
      </div>
      <div className="min-h-[200px]">
        <Editor
          editorState={editorState}
          onChange={setEditorState}
          handleKeyCommand={handleKeyCommand}
          placeholder="Write your content here..."
        />
      </div>
    </div>
  );
};

export default RichTextEditor;
