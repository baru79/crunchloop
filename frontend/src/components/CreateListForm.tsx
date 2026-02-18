import { useState } from "react";
import { PlusIcon } from "./icons/PlusIcon";
import { Input } from "./Input";

interface CreateListFormProps {
  onSubmit: (name: string) => Promise<void>;
  isLoading?: boolean;
}

export const CreateListForm = ({
  onSubmit,
  isLoading,
}: CreateListFormProps) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setLoading(true);
      await onSubmit(name.trim());
      setName("");
    } finally {
      setLoading(false);
    }
  };

  const handleIconClick = async () => {
    if (!name.trim() || loading || isLoading) return;
    try {
      setLoading(true);
      await onSubmit(name.trim());
      setName("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <Input
        value={name}
        onChange={setName}
        placeholder="New list name..."
        disabled={loading || isLoading}
        icon={
          <PlusIcon width={48} height={48} className="hover:cursor-default" />
        }
        onIconClick={handleIconClick}
        iconTitle="Create list"
        inputClassName="py-2 text-sm"
      />
    </form>
  );
};
