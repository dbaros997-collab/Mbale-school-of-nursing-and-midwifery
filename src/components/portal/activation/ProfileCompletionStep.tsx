"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  FieldLabel,
  StepCard,
  activationInputClass,
} from "@/components/portal/activation/form";
import type { WizardDraft } from "@/components/portal/activation/types";

type Props = {
  draft: WizardDraft;
  busy: boolean;
  onChange: (patch: Partial<WizardDraft>) => void;
  onBack: () => void;
  onContinue: () => void;
};

export function ProfileCompletionStep({
  draft,
  busy,
  onChange,
  onBack,
  onContinue,
}: Props) {
  return (
    <StepCard>
      <h2 className="text-xl font-extrabold text-primary">Complete your profile</h2>
      <p className="mt-1 text-sm text-muted">
        Provide next-of-kin, emergency contact, and medical details required by MBSNM.
      </p>

      <form
        className="mt-6 space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          onContinue();
        }}
      >
        <fieldset className="space-y-4">
          <legend className="text-sm font-bold uppercase tracking-wide text-primary">
            Personal contact
          </legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="phone" required>
                Phone
              </FieldLabel>
              <input
                id="phone"
                required
                className={activationInputClass}
                value={draft.phone}
                onChange={(e) => onChange({ phone: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <FieldLabel htmlFor="address" required>
                Residential address
              </FieldLabel>
              <input
                id="address"
                required
                className={activationInputClass}
                value={draft.address}
                onChange={(e) => onChange({ address: e.target.value })}
              />
            </div>
          </div>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="text-sm font-bold uppercase tracking-wide text-primary">
            Next of kin
          </legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="kin-name" required>
                Full name
              </FieldLabel>
              <input
                id="kin-name"
                required
                className={activationInputClass}
                value={draft.nextOfKin.name}
                onChange={(e) =>
                  onChange({ nextOfKin: { ...draft.nextOfKin, name: e.target.value } })
                }
              />
            </div>
            <div>
              <FieldLabel htmlFor="kin-rel" required>
                Relationship
              </FieldLabel>
              <input
                id="kin-rel"
                required
                className={activationInputClass}
                placeholder="Parent / Guardian"
                value={draft.nextOfKin.relationship}
                onChange={(e) =>
                  onChange({
                    nextOfKin: { ...draft.nextOfKin, relationship: e.target.value },
                  })
                }
              />
            </div>
            <div>
              <FieldLabel htmlFor="kin-phone" required>
                Phone
              </FieldLabel>
              <input
                id="kin-phone"
                required
                className={activationInputClass}
                value={draft.nextOfKin.phone}
                onChange={(e) =>
                  onChange({ nextOfKin: { ...draft.nextOfKin, phone: e.target.value } })
                }
              />
            </div>
            <div>
              <FieldLabel htmlFor="kin-email">Email</FieldLabel>
              <input
                id="kin-email"
                type="email"
                className={activationInputClass}
                value={draft.nextOfKin.email}
                onChange={(e) =>
                  onChange({ nextOfKin: { ...draft.nextOfKin, email: e.target.value } })
                }
              />
            </div>
          </div>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="text-sm font-bold uppercase tracking-wide text-primary">
            Emergency contact
          </legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="em-name" required>
                Full name
              </FieldLabel>
              <input
                id="em-name"
                required
                className={activationInputClass}
                value={draft.emergencyContact.name}
                onChange={(e) =>
                  onChange({
                    emergencyContact: {
                      ...draft.emergencyContact,
                      name: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div>
              <FieldLabel htmlFor="em-rel" required>
                Relationship
              </FieldLabel>
              <input
                id="em-rel"
                required
                className={activationInputClass}
                value={draft.emergencyContact.relationship}
                onChange={(e) =>
                  onChange({
                    emergencyContact: {
                      ...draft.emergencyContact,
                      relationship: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div className="sm:col-span-2">
              <FieldLabel htmlFor="em-phone" required>
                Phone
              </FieldLabel>
              <input
                id="em-phone"
                required
                className={activationInputClass}
                value={draft.emergencyContact.phone}
                onChange={(e) =>
                  onChange({
                    emergencyContact: {
                      ...draft.emergencyContact,
                      phone: e.target.value,
                    },
                  })
                }
              />
            </div>
          </div>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="text-sm font-bold uppercase tracking-wide text-primary">
            Medical / health information
          </legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="blood" required>
                Blood group
              </FieldLabel>
              <select
                id="blood"
                required
                className={activationInputClass}
                value={draft.medicalInfo.bloodGroup}
                onChange={(e) =>
                  onChange({
                    medicalInfo: { ...draft.medicalInfo, bloodGroup: e.target.value },
                  })
                }
              >
                <option value="">Select</option>
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Unknown"].map(
                  (g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ),
                )}
              </select>
            </div>
            <div>
              <FieldLabel htmlFor="allergies">Allergies</FieldLabel>
              <input
                id="allergies"
                className={activationInputClass}
                placeholder="None known"
                value={draft.medicalInfo.allergies}
                onChange={(e) =>
                  onChange({
                    medicalInfo: { ...draft.medicalInfo, allergies: e.target.value },
                  })
                }
              />
            </div>
            <div>
              <FieldLabel htmlFor="chronic">Chronic conditions</FieldLabel>
              <input
                id="chronic"
                className={activationInputClass}
                placeholder="None"
                value={draft.medicalInfo.chronicConditions}
                onChange={(e) =>
                  onChange({
                    medicalInfo: {
                      ...draft.medicalInfo,
                      chronicConditions: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div>
              <FieldLabel htmlFor="disabilities">Disabilities / support needs</FieldLabel>
              <input
                id="disabilities"
                className={activationInputClass}
                placeholder="None"
                value={draft.medicalInfo.disabilities}
                onChange={(e) =>
                  onChange({
                    medicalInfo: {
                      ...draft.medicalInfo,
                      disabilities: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div>
              <FieldLabel htmlFor="doctor">Family doctor / clinic</FieldLabel>
              <input
                id="doctor"
                className={activationInputClass}
                value={draft.medicalInfo.doctorName}
                onChange={(e) =>
                  onChange({
                    medicalInfo: { ...draft.medicalInfo, doctorName: e.target.value },
                  })
                }
              />
            </div>
            <div>
              <FieldLabel htmlFor="doctor-phone">Doctor phone</FieldLabel>
              <input
                id="doctor-phone"
                className={activationInputClass}
                value={draft.medicalInfo.doctorPhone}
                onChange={(e) =>
                  onChange({
                    medicalInfo: {
                      ...draft.medicalInfo,
                      doctorPhone: e.target.value,
                    },
                  })
                }
              />
            </div>
          </div>
        </fieldset>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onBack} disabled={busy}>
            Back
          </Button>
          <Button type="submit" variant="green" disabled={busy}>
            {busy ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Activating…
              </>
            ) : (
              "Activate account"
            )}
          </Button>
        </div>
      </form>
    </StepCard>
  );
}
