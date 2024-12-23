import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileIcon, TrashIcon } from "@radix-ui/react-icons";
import { formatDistanceToNow } from "date-fns";
import { formatFileSize } from "@/lib/utils/form";
import type { File } from "@/lib/validations/forms";

const mockFiles: File[] = [
  {
    id: "1",
    name: "document.pdf",
    type: "application/pdf",
    size: 1024 * 1024 * 2.5, // 2.5MB
    uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: "2",
    name: "data.json",
    type: "application/json",
    size: 1024 * 512, // 512KB
    uploadedAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
  },
];

export default function FilesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold">File Management</h1>
        <p className="text-muted-foreground">
          Upload and manage your documents
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload Files</CardTitle>
          <CardDescription>
            Drag and drop files here or click to browse
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center rounded-lg border border-dashed p-12">
            <Button>Choose Files</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Files</CardTitle>
          <CardDescription>View and manage your uploaded files</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockFiles.map((file) => (
                <TableRow key={file.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileIcon className="h-4 w-4" />
                      {file.name}
                    </div>
                  </TableCell>
                  <TableCell>{formatFileSize(file.size)}</TableCell>
                  <TableCell>
                    {formatDistanceToNow(file.uploadedAt, { addSuffix: true })}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
