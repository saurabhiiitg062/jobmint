"use client";

import AdminJobEditor from '@/components/AdminJobEditor';
import TiptapEditor from "@/components/TiptapEditor";
import { useState } from 'react';

export default function AdminCreateJobPage() {
  const [description, setDescription] = useState("");
  return (
    <div className="max-w-4xl mx-auto my-8">
      <div className="mb-4">
        <TiptapEditor
        value={description}
        onChange={(value) => {
          setDescription(value);
        }}
      />
      </div>
     
    </div>
  );
}
