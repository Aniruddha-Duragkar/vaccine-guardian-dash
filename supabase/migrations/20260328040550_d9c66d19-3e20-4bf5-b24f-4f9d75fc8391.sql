
-- Create table for temperature readings
CREATE TABLE public.temperature_readings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  device_id TEXT NOT NULL DEFAULT 'VX-MCL-2024-0042',
  temperature NUMERIC(4,1) NOT NULL,
  humidity NUMERIC(4,1) NOT NULL,
  battery_level NUMERIC(4,1) NOT NULL DEFAULT 73,
  peltier_status TEXT NOT NULL DEFAULT 'Idle',
  door_status TEXT NOT NULL DEFAULT 'Closed',
  signal_strength INTEGER NOT NULL DEFAULT 85,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.temperature_readings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read temperature readings"
  ON public.temperature_readings FOR SELECT USING (true);

CREATE POLICY "Anyone can insert temperature readings"
  ON public.temperature_readings FOR INSERT WITH CHECK (true);

-- Create alerts table
CREATE TABLE public.device_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  device_id TEXT NOT NULL DEFAULT 'VX-MCL-2024-0042',
  message TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('critical', 'warning', 'info')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.device_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read alerts"
  ON public.device_alerts FOR SELECT USING (true);

CREATE POLICY "Anyone can insert alerts"
  ON public.device_alerts FOR INSERT WITH CHECK (true);

-- Seed temperature readings
INSERT INTO public.temperature_readings (temperature, humidity, battery_level, peltier_status, created_at)
SELECT
  round((random() * 4.5 + 3.0)::numeric, 1),
  round((random() * 25 + 40)::numeric, 1),
  round((73 - (i * 0.1))::numeric, 1),
  CASE WHEN random() > 0.6 THEN 'Cooling' WHEN random() > 0.3 THEN 'Idle' ELSE 'Heating' END,
  now() - (i || ' minutes')::interval
FROM generate_series(1, 30) AS i;

-- Seed alerts
INSERT INTO public.device_alerts (message, level, created_at) VALUES
  ('Temperature exceeded 8°C', 'critical', now() - interval '2 hours'),
  ('Door opened for >30s', 'warning', now() - interval '3 hours'),
  ('Battery below 20%', 'warning', now() - interval '4 hours'),
  ('Temperature spike detected', 'critical', now() - interval '5 hours'),
  ('System cooled to target', 'info', now() - interval '6 hours');
