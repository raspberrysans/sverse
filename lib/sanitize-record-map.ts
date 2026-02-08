import type { ExtendedRecordMap } from 'notion-types'

/**
 * Sanitizes a record map by removing blocks with invalid or missing IDs
 * This prevents errors when rendering malformed Notion data
 */
export function sanitizeRecordMap(recordMap: ExtendedRecordMap): ExtendedRecordMap {
  if (!recordMap || !recordMap.block) {
    return recordMap
  }

  const sanitizedBlock: Record<string, any> = {}
  
  for (const [key, value] of Object.entries(recordMap.block)) {
    try {
      // Check if the block has a valid structure
      if (value && value.value) {
        const block = value.value
        
        // Only include blocks that have a valid id
        if (block.id && typeof block.id === 'string' && block.id.trim()) {
          sanitizedBlock[key] = value
        } else {
          console.warn(`Skipping block with invalid ID:`, key, block)
        }
      } else {
        sanitizedBlock[key] = value
      }
    } catch (err) {
      console.warn(`Error processing block ${key}:`, err)
      // Keep the block as-is if there's an error checking it
      sanitizedBlock[key] = value
    }
  }

  return {
    ...recordMap,
    block: sanitizedBlock
  }
}
