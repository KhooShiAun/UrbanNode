import './Notifications.css'

type NotificationType = 'resolved' | 'in-progress' | 'assigned' | 'submitted' | 'sla'

interface Notification {
  id: string
  type: NotificationType
  message: string
  timestamp: string
}

interface NotificationGroup {
  label: string
  items: Notification[]
}

const NOTIFICATION_GROUPS: NotificationGroup[] = [
  {
    label: 'Today',
    items: [
      {
        id: '1',
        type: 'resolved',
        message: 'Your report UR-031 has been marked as Resolved',
        timestamp: '5/25/2026, 10:30:00 AM',
      },
      {
        id: '2',
        type: 'in-progress',
        message: 'Report UR-042 is now In Progress – Ahmad bin Ali is working on it',
        timestamp: '5/25/2026, 8:15:00 AM',
      },
    ],
  },
  {
    label: 'Yesterday',
    items: [
      {
        id: '3',
        type: 'assigned',
        message: 'Your report UR-042 has been assigned to a city worker',
        timestamp: '5/24/2026, 4:45:00 PM',
      },
      {
        id: '4',
        type: 'submitted',
        message: 'Report UR-038 has been submitted successfully',
        timestamp: '5/24/2026, 2:20:00 PM',
      },
    ],
  },
  {
    label: 'Earlier',
    items: [
      {
        id: '5',
        type: 'sla',
        message: 'SLA deadline approaching for report UR-029 – 24 hours remaining',
        timestamp: '5/23/2026, 9:00:00 AM',
      },
    ],
  },
]

const CheckCircleIcon = ({ color }: { color: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
)

const ClockIcon = ({ color }: { color: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)

const InfoIcon = ({ color }: { color: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
)

interface IconConfig {
  icon: React.ReactNode
  accentColor: string | null
  bgColor: string
  iconBg: string
}

function getIconConfig(type: NotificationType): IconConfig {
  switch (type) {
    case 'resolved':
      return {
        icon: <CheckCircleIcon color="#3db88b" />,
        accentColor: '#3db88b',
        bgColor: '#f0faf6',
        iconBg: '#ffffff',
      }
    case 'in-progress':
      return {
        icon: <ClockIcon color="#f97316" />,
        accentColor: '#f97316',
        bgColor: '#fff7f0',
        iconBg: '#ffffff',
      }
    case 'assigned':
      return {
        icon: <CheckCircleIcon color="#9ca3af" />,
        accentColor: null,
        bgColor: '#f9fafb',
        iconBg: '#e5e7eb',
      }
    case 'submitted':
      return {
        icon: <CheckCircleIcon color="#3db88b" />,
        accentColor: null,
        bgColor: '#f9fafb',
        iconBg: '#e5e7eb',
      }
    case 'sla':
      return {
        icon: <InfoIcon color="#9ca3af" />,
        accentColor: null,
        bgColor: '#f9fafb',
        iconBg: '#e5e7eb',
      }
  }
}

function NotificationItem({ notification }: { notification: Notification }) {
  const config = getIconConfig(notification.type)

  return (
    <div
      className="notif-item"
      style={{ backgroundColor: config.bgColor }}
    >
      {config.accentColor && (
        <div className="notif-item__accent" style={{ backgroundColor: config.accentColor }} />
      )}
      <div className="notif-item__icon" style={{ backgroundColor: config.iconBg }}>
        {config.icon}
      </div>
      <div className="notif-item__body">
        <p className="notif-item__message">{notification.message}</p>
        <span className="notif-item__time">{notification.timestamp}</span>
      </div>
    </div>
  )
}

export function Notifications() {
  return (
    <div className="notifications">
      <div className="notifications__header">
        <h1 className="notifications__title">Notifications</h1>
      </div>

      <div className="notifications__content">
        {NOTIFICATION_GROUPS.map((group) => (
          <section key={group.label} className="notif-group">
            <h2 className="notif-group__label">{group.label}</h2>
            <div className="notif-group__items">
              {group.items.map((item) => (
                <NotificationItem key={item.id} notification={item} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
