import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
  Stack,
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import InfoOutlineIcon from "@mui/icons-material/InfoOutline";

// ====== Types ======
type AddOn = {
  id: string;
  name: string;
  desc?: string;
  price: string;
};

type Service = {
  id: string;
  name: string;
  desc: string;
  price: string;
  duration: string;
  addOns?: AddOn[];
};

type Category = {
  id: string;
  title: string;
  services: Service[];
};

// ====== Style tokens (tweak to match your brand) ======
const BROWN = '#B89072';
const HEADER_BROWN = '#C2A489';
const BORDER = '#E6DFD8';
const TEXT_MUTED = '#6C757D';

// ====== Demo data (replace with API data) ======
const data: Category[] = [
  {
    id: 'tox',
    title: 'Tox',
    services: [
      {
        id: 'botox',
        name: 'Botox',
        desc: 'Smooth, prevent and reduce wrinkles',
        price: '$13.00',
        duration: '60min',
        addOns: [
          { id: 'chem-peel', name: 'Chemical Peel', desc: 'Refine, tone and revitalize', price: '$200.00' },
          // more add-ons can go here
        ],
      },
      {
        id: 'jeuveau',
        name: 'Jeuveau',
        desc: 'Smooth, prevent and reduce wrinkles',
        price: '$13.00',
        duration: '60min',
      },
    ],
  },
  { id: 'microneedling', title: 'Microneedling', services: [] },
  { id: 'chemical-peels', title: 'Chemical Peels', services: [] },
  { id: 'lip-filler', title: 'Lip Filler', services: [] },
  { id: 'wellness-shots', title: 'Wellness Shots', services: [] },
];

// ====== Main component ======
export default function ServiceAccordionList() {
  // Which category accordion is expanded
  const [expanded, setExpanded] = React.useState<string | false>('tox');

  // Single selected primary service per category (Radio behavior)
  const [selectedServiceByCategory, setSelectedServiceByCategory] = React.useState<
    Record<string, string | null>
  >({
    tox: 'botox',
  });

  // Multi-selected add-ons per primary service (Checkbox behavior)
  // key: serviceId -> Set of addOnIds
  const [selectedAddOnsByService, setSelectedAddOnsByService] = React.useState<
    Record<string, Set<string>>
  >({
    botox: new Set(['chem-peel']), // example preselection; remove if not needed
  });

  const handleExpand =
    (panel: string) => (_e: React.SyntheticEvent, isExpanded: boolean) =>
      setExpanded(isExpanded ? panel : false);

  const handleSelectService = (categoryId: string, serviceId: string) => {
    setSelectedServiceByCategory((prev) => ({ ...prev, [categoryId]: serviceId }));
    // Optional: If you want to clear add-ons when switching services,
    // uncomment the lines below:
    setSelectedAddOnsByService((prev) => {
      const next = { ...prev };
      if (!next[serviceId]) next[serviceId] = new Set();
      return next;
    });
  };

  const toggleAddOn = (serviceId: string, addOnId: string) => {
    setSelectedAddOnsByService((prev) => {
      const current = new Set(prev[serviceId] ?? []);
      if (current.has(addOnId)) current.delete(addOnId);
      else current.add(addOnId);
      return { ...prev, [serviceId]: current };
    });
  };

  // You can expose the combined selection (primary + add-ons) to a parent via props or a callback.
  // Example: build a payload
  const getSelectionPayload = React.useCallback(() => {
    return Object.entries(selectedServiceByCategory).map(([categoryId, svcId]) => ({
      categoryId,
      serviceId: svcId,
      addOnIds: svcId ? Array.from(selectedAddOnsByService[svcId] ?? []) : [],
    }));
  }, [selectedServiceByCategory, selectedAddOnsByService]);

  // Example usage (log whenever selection changes)
  React.useEffect(() => {
    // console.log(getSelectionPayload());
  }, [getSelectionPayload]);

  return (
    <Box sx={{ p: 2 }}>
      {data.map((cat) => (
        <Accordion
          key={cat.id}
          expanded={expanded === cat.id}
          onChange={handleExpand(cat.id)}
          disableGutters
          square
          sx={{
            mb: 2,
            border: `1px solid ${BORDER}`,
            boxShadow: 'none',
            '&:before': { display: 'none' },
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: expanded === cat.id ? '#fff' : 'black' }} />}
            sx={{
              bgcolor: expanded === cat.id ? HEADER_BROWN : 'white',
              color: expanded === cat.id ? '#fff' : 'black',
              '& .MuiAccordionSummary-content': { my: 0.5 },
              minHeight: 48,
            }}
          >
            <Typography sx={{ fontWeight: 700 }} component={'span'}>{cat.title} <InfoOutlineIcon sx={{ fontSize: "17px", color: "#B89072" }} /></Typography>
          </AccordionSummary>

          <AccordionDetails sx={{ p: 0 }}>
            {cat.services.length === 0 ? (
              <Box sx={{ p: 2, color: TEXT_MUTED }}>No services listed</Box>
            ) : (
              <RadioGroup
                value={selectedServiceByCategory[cat.id] ?? ''}
                onChange={(_, v) => handleSelectService(cat.id, v)}
                sx={{ width: '100%' }}
              >
                {cat.services.map((svc, idx) => {
                  const checked = (selectedServiceByCategory[cat.id] ?? '') === svc.id;
                  const showAddOns = checked && svc.addOns && svc.addOns.length > 0;

                  return (
                    <React.Fragment key={svc.id}>
                      <ServiceRow service={svc} checked={checked} />

                      {showAddOns && (
                        <>
                          <Divider sx={{ mx: 2, borderColor: BORDER }} />
                          <AddOnBlock
                            parentName={svc.name}
                            serviceId={svc.id}
                            items={svc.addOns!}
                            selectedIds={selectedAddOnsByService[svc.id] ?? new Set<string>()}
                            onToggle={(id) => toggleAddOn(svc.id, id)}
                          />
                        </>
                      )}

                      {idx < cat.services.length - 1 && (
                        <Divider sx={{ mx: 2, borderColor: BORDER }} />
                      )}
                    </React.Fragment>
                  );
                })}
              </RadioGroup>
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}

// ====== Subcomponents ======

function ServiceRow({ service, checked }: { service: Service; checked: boolean }) {
  return (
    <FormControlLabel
      value={service.id}
      control={
        <Radio
          icon={<RadioButtonUncheckedIcon sx={{ color: BROWN }} />}
          checkedIcon={<CheckCircleIcon sx={{ color: BROWN }} />}
          sx={{ p: 1.5 }}
        />
      }
      label={
        <RowLayout
          left={
            <>
              <Typography sx={{ fontWeight: 700, color: '#222' }}>{service.name}</Typography>
              <Typography sx={{ fontSize: 14, color: TEXT_MUTED }}>{service.desc}</Typography>
            </>
          }
          right={
            <>
              <Typography sx={{ fontWeight: 700, color: '#222' }}>{service.price}</Typography>
              <Typography sx={{ fontSize: 14, color: TEXT_MUTED }}>{service.duration}</Typography>
            </>
          }
        />
      }
      sx={{
        m: 0,
        px: 2,
        py: 1.5,
        width: '100%',
        alignItems: 'flex-start',
        '& .MuiFormControlLabel-label': { width: '100%' },
        bgcolor: checked ? 'rgba(185,144,114,0.08)' : 'transparent',
        '&:hover': { backgroundColor: 'rgba(185,144,114,0.06)' },
      }}
    />
  );
}

function AddOnBlock({
  parentName,
  items,
  selectedIds,
  onToggle,
}: {
  parentName: string;
  serviceId: string;
  items: AddOn[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
}) {
  return (
    <Box sx={{ pl: 4, pt: 1, pb: 1 }}>
      <Typography sx={{ fontSize: 14, color: BROWN, fontWeight: 600, mb: 0.5 }}>
        Add‑on Services ({parentName})
      </Typography>

      <Stack>
        {items.map((a, i) => (
          <React.Fragment key={a.id}>
            <AddOnRow
              addOn={a}
              checked={selectedIds.has(a.id)}
              onChange={() => onToggle(a.id)}
            />
            {i < items.length - 1 && <Divider sx={{ borderColor: BORDER }} />}
          </React.Fragment>
        ))}
      </Stack>
    </Box>
  );
}

function AddOnRow({
  addOn,
  checked,
  onChange,
}: {
  addOn: AddOn;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <Box
      sx={{
        py: 1,
        px: 2,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
      }}
    >
      <Stack direction="row" spacing={1} alignItems="flex-start">
        <Checkbox
          checked={checked}
          onChange={onChange}
          sx={{ pl: 1.5 }}
          icon={<CheckCircleOutlineIcon sx={{ color: BROWN, opacity: 0.5 }} />}
          checkedIcon={<CheckCircleIcon sx={{ color: BROWN }} />}
        />
        <Box>
          <Typography sx={{ fontWeight: 700, color: '#222' }}>{addOn.name}</Typography>
          {addOn.desc && (
            <Typography sx={{ fontSize: 14, color: TEXT_MUTED }}>{addOn.desc}</Typography>
          )}
        </Box>
      </Stack>

      <Typography sx={{ fontWeight: 700, color: '#222', minWidth: 84, textAlign: 'right' }}>
        {addOn.price}
      </Typography>
    </Box>
  );
}

function RowLayout({
  left,
  right,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
}) {
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%' }}>
      <Box>{left}</Box>
      <Box sx={{ textAlign: 'right', minWidth: 108 }}>{right}</Box>
    </Stack>
  );
}
