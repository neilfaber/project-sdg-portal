
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ContentModeration = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Moderation</CardTitle>
        <CardDescription>
          Review and moderate user-generated content
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-muted-foreground">
          <p>No content flagged for moderation at this time.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentModeration;
