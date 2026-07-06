"use client";

import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";

import { Profile } from "@/hooks/useProfile";

interface Props {
  profile: Profile;
}

export default function ProfileCard({
  profile,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">
          My Profile
        </h2>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">

          <div>
            <p className="text-sm text-gray-500">
              Email
            </p>

            <p>{profile.email}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Role
            </p>

            <p>{profile.role}</p>
          </div>

          {profile.faculty && (
            <>
              <div>
                <p className="text-sm text-gray-500">
                  Name
                </p>

                <p>
                  {profile.faculty.firstName}{" "}
                  {profile.faculty.lastName}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Department
                </p>

                <p>
                  {profile.faculty.department.name}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Designation
                </p>

                <p>
                  {profile.faculty.designation}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Qualification
                </p>

                <p>
                  {profile.faculty.qualification}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Experience
                </p>

                <p>
                  {profile.faculty.experienceYears} Years
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Phone
                </p>

                <p>
                  {profile.faculty.phone}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Bio
                </p>

                <p>
                  {profile.faculty.bio || "-"}
                </p>
              </div>
            </>
          )}

        </div>
      </CardContent>
    </Card>
  );
}