import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';

function AccordionItem({ item, isOpen, onToggle }) {
  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 text-left hover:text-primary transition-colors"
        aria-expanded={isOpen}
      >
        <h3 className="text-lg font-semibold pr-4">{item.question}</h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <FaChevronDown className="text-primary" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pb-4 text-gray-700">
              {item.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Accordion({ items, allowMultiple = false, className = '' }) {
  const [openItems, setOpenItems] = useState(allowMultiple ? [] : null);

  const handleToggle = (index) => {
    if (allowMultiple) {
      setOpenItems(prev =>
        prev.includes(index)
          ? prev.filter(i => i !== index)
          : [...prev, index]
      );
    } else {
      setOpenItems(openItems === index ? null : index);
    }
  };

  const isItemOpen = (index) => {
    return allowMultiple ? openItems.includes(index) : openItems === index;
  };

  return (
    <div className={`divide-y divide-gray-200 ${className}`}>
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          item={item}
          isOpen={isItemOpen(index)}
          onToggle={() => handleToggle(index)}
        />
      ))}
    </div>
  );
}

export default Accordion;
