/** @jsxRuntime classic */
/** @jsx jsx */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { jsx } from '@keystone-ui/core'
import { component, fields, NotEditable } from '@keystone-6/fields-document/component-blocks'

import { getListItemText } from './utils'

// A jobs table component block for the Careers page.

export const Jobs = component({
  preview: (props) => {
    return (
      <div>
        <NotEditable>
          <ul style={{ listStyleType: 'none' }}>
            {props.fields.jobs.elements.map((element, index) => {
              return (
                <div>
                  <li>
                    Job {index + 1} Title - {element.fields.jobTitle.value}
                  </li>
                  <li>
                    Job {index + 1} Location - {element.fields.jobLocation.value}
                  </li>
                  <li>
                    Job {index + 1} Apply Link Label - {element.fields.jobLink.value}
                  </li>
                </div>
              )
            })}
          </ul>
        </NotEditable>
      </div>
    )
  },
  label: 'Jobs',
  schema: {
    jobs: fields.array(
      fields.object({
        jobId: fields.text({ label: 'Job ID' }),
        jobTitle: fields.text({ label: 'Job Title' }),
        experienceRequired: fields.select({
          label: 'Experience Required',
          options: [
            {
              label: 'Fresher',
              value: 'Fresher',
            },
            {
              label: '0-3 years',
              value: '0-3 years',
            },
            {
              label: '3-7 years',
              value: '3-7 years',
            },
            {
              label: '7-10 years',
              value: '7-10 years',
            },
            {
              label: '10+ years',
              value: '10+ years',
            },
          ],
          defaultValue: 'Fresher',
        }),
        department: fields.select({
          label: 'Department',
          options: [
            { label: 'Operations', value: 'operations' },
            { label: 'Technology & Product', value: 'technology-and-product' },
            { label: 'Sales & Marketing', value: 'sales-and-marketing' },
            { label: 'HR', value: 'hr' },
            { label: 'Legal', value: 'legal' },
            { label: 'Finance', value: 'finance' },
          ],
          defaultValue: 'operations',
        }),
        jobLocation: fields.select({
          label: 'Job Location',
          options: [
            { label: 'Sydney', value: 'Sydney' },
            { label: 'Jaipur', value: 'Jaipur' },
          ],
          defaultValue: 'Sydney',
        }),
        jobType: fields.select({
          label: 'Job Type',
          options: [{ label: 'Full Time', value: 'Full Time' }],
          defaultValue: 'Full Time',
        }),
        jobLink: fields.text({ label: 'Link Label' }),
        legalEntity: fields.text({ label: 'Legal Entity' }),
        qualifications: fields.text({ label: 'Qualifications' }),
      }),
      {
        label: 'Add jobs',
        itemLabel: (props) =>
          getListItemText({
            item: [
              props?.fields?.jobTitle?.value,
              props?.fields?.department?.value,
              props?.fields?.jobId?.value,
            ],
            defaultValue: 'Job',
          }),
      },
    ),
  },
})
