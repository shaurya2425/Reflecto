import { useState } from "react";
import { useAuth } from "@/context/AuthContext"; // ✅ import your auth hook
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Edit } from "lucide-react";

export function ProfilePage() {
  const { user, logout } = useAuth(); // ✅ get current logged-in user
  const [isEditing, setIsEditing] = useState(false);

  // ✅ initialize editable profile fields with Firebase user
  const [profile, setProfile] = useState({
    name: user?.displayName || "Anonymous User",
    email: user?.email || "No email provided",
    bio: "On a journey of self-discovery and mindfulness.",
    joinDate: user?.metadata?.creationTime || new Date().toISOString(),
    avatar: user?.photoURL || "",
  });

  const handleSave = () => {
    console.log("Saving profile:", profile);
    setIsEditing(false);
    // ✅ Later: update Firebase user profile (updateProfile)
  };

  return (
    <div className="min-h-screen p-6 bg-[#0B1210]">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Profile</h1>
          <p className="text-gray-400">Your journey and achievements</p>
        </div>

        {/* User Details */}
        <Card className="bg-[#0D1F1C] glass-card border border-green-500/15">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center space-x-2">
                <User className="w-5 h-5 text-green-400" />
                <span>Personal Information</span>
              </CardTitle>
              <div className="flex space-x-2">
                <Button
                  onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                  variant="outline"
                  className="border-green-500/30 text-green-400 hover:bg-green-500/10"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  {isEditing ? "Save" : "Edit"}
                </Button>
                <Button
                  onClick={logout}
                  variant="outline"
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                >
                  Logout
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="flex items-start space-x-6">
              <Avatar className="w-20 h-20 border-2 border-green-500/30">
                <AvatarImage src={profile.avatar} alt={profile.name} />
                <AvatarFallback className="bg-green-500/20 text-green-400 text-xl">
                  {profile.name[0]}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-4">
                {/* Name + Email */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-300 mb-2 block">
                      Display Name
                    </label>
                    {isEditing ? (
                      <Input
                        value={profile.name}
                        onChange={(e) =>
                          setProfile((prev) => ({ ...prev, name: e.target.value }))
                        }
                        className="glass border-green-500/30 focus:border-green-400 text-white"
                      />
                    ) : (
                      <p className="text-white">{profile.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm text-gray-300 mb-2 block">
                      Email
                    </label>
                    <p className="text-white">{profile.email}</p>
                  </div>
                </div>

                {/* Bio */}
                

                {/* Join Date */}
                
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
