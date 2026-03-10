import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import "./Settings.scss";

export default function Settings() {
  // State for various settings
  const [profile, setProfile] = useState({
    name: "",
    bio: "",
    avatar: "",
  });
  const [account, setAccount] = useState({
    email: "",
    password: "",
  });
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
  });
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    searchEngine: false,
  });
  const [appearance, setAppearance] = useState("system");

  return (
    <div className="settings-page">
      <Card className="shadow-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-indigo-700">Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-10">
          {/* Profile Section */}
          <section>
            <h2 className="text-xl font-semibold text-indigo-600 mb-2">Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={e => setProfile({ ...profile, name: e.target.value })}
                  placeholder="Your Name"
                />
              </div>
              <div>
                <Label htmlFor="avatar">Avatar URL</Label>
                <Input
                  id="avatar"
                  value={profile.avatar}
                  onChange={e => setProfile({ ...profile, avatar: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={e => setProfile({ ...profile, bio: e.target.value })}
                  placeholder="Tell us about yourself"
                />
              </div>
            </div>
          </section>
          <Separator />
          {/* Account Section */}
          <section>
            <h2 className="text-xl font-semibold text-indigo-600 mb-2">Account</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={account.email}
                  onChange={e => setAccount({ ...account, email: e.target.value })}
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={account.password}
                  onChange={e => setAccount({ ...account, password: e.target.value })}
                  placeholder="••••••••"
                />
              </div>
            </div>
          </section>
          <Separator />
          {/* Notifications Section */}
          <section>
            <h2 className="text-xl font-semibold text-indigo-600 mb-2">Notifications</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Email Notifications</Label>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={v => setNotifications({ ...notifications, email: v })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>SMS Notifications</Label>
                <Switch
                  checked={notifications.sms}
                  onCheckedChange={v => setNotifications({ ...notifications, sms: v })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Push Notifications</Label>
                <Switch
                  checked={notifications.push}
                  onCheckedChange={v => setNotifications({ ...notifications, push: v })}
                />
              </div>
            </div>
          </section>
          <Separator />
          {/* Privacy Section */}
          <section>
            <h2 className="text-xl font-semibold text-indigo-600 mb-2">Privacy</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Profile Visible</Label>
                <Switch
                  checked={privacy.profileVisible}
                  onCheckedChange={v => setPrivacy({ ...privacy, profileVisible: v })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Allow Search Engines</Label>
                <Switch
                  checked={privacy.searchEngine}
                  onCheckedChange={v => setPrivacy({ ...privacy, searchEngine: v })}
                />
              </div>
            </div>
          </section>
          <Separator />
          {/* Appearance Section */}
          <section>
            <h2 className="text-xl font-semibold text-indigo-600 mb-2">Appearance</h2>
            <select value={appearance} onChange={e => setAppearance(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md">
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </section>
          <Separator />
          {/* Save Button */}
          <div className="flex justify-end">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
              Save All Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}