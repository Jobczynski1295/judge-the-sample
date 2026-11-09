# My decisions and evidence notes

## 1. Population and target

- **Scenario and file:** Healthcare Costs, using `data/healthcare_costs.csv`.

- **One row means:** Each row represents an individual beneficiary record, including demographic information, smoking status, geographic region, and medical charges.

- **Number of rows (N):** 1,338.

- **Row order, and what it means in this file:** The dataset is maintained in its original file order. There is no documented chronological sequence or other meaningful ordering, so I would not assume the rows reflect when medical services occurred.

- **Target column and units:** `charges`, representing individual medical charges in US dollars.

- **My finite population is (and what it is not):** For this assignment, my finite population consists of all 1,338 records in the provided Healthcare Costs dataset. Although I am treating these records as the complete population for this exercise, they should not be interpreted as representative of all patients, current medical claims, or healthcare costs across the United States.

- **True mean I calculated (and how):** The population mean is **$13,270.42**. I calculated this by summing the `charges` values across all 1,338 records and dividing by the total number of records. Since every record was included, this represents the true mean of the population used in this assignment.

## 2. Design choices

For each stage, I recorded the option I selected, why I chose it, and what I wanted users to learn from it.

- **Stage 2, visualization (include one visual feature meant to reveal a sampling problem):**

  I selected a distribution dashboard with a histogram showing medical charges across the population. The dashboard also displays the population mean and the sample estimate.

  I wanted users to see how the distribution of charges could influence the results, particularly when a sample includes or excludes beneficiaries with unusually high medical costs. Highlighting the sampled records helps demonstrate why different samples may produce different estimates.

- **Stage 3, sampling interactions and stratification column:**

  I selected simple random, systematic, and stratified sampling, with controls for sample size, sampling method, and random seed.

  For stratified sampling, I chose `region` with proportional allocation. This allows the sample to reflect the geographic distribution of the original dataset. My goal was to let users compare how different selection methods affect estimates while keeping the sample size consistent.

- **Stage 4, presentation of the method comparison and sample-size experiments:**

  I chose a results table displaying bias, standard deviation, and RMSE. I felt that a table would make it easier to compare the numerical results without relying entirely on visual interpretation.

  For the method comparison, I used n = 100. For the sample-size experiment, I compared simple random samples of n = 1, 10, and 100 to see how sample size influences variability and estimation error.

- **Stage 5, challenge controls and my alternative method or correction:**

  I chose to evaluate how changing the order of the dataset affects systematic sampling. The challenge compares the original Healthcare Costs dataset with a modified copy sorted by medical charges from lowest to highest.

  I selected simple random sampling as the alternative method because it does not rely on selecting records at regular intervals. The challenge uses the same sample size, repetitions, and seed across the comparisons to help evaluate the impact of changing the record order.

  I wanted this experiment to demonstrate that the way a dataset is organized can influence the performance of a sampling method, even when the underlying population remains unchanged.

## 3. Results table

The following results were generated using the Healthcare Costs population. The baseline population contains 1,338 records with a true mean of $13,270.42.

All experiments used seed 2026 and 1,000 Monte Carlo repetitions. Each row represents a separate result, and the modified population's true mean was recalculated after sorting.

| Experiment | Population or condition | Method | Settings | Seed (or exact) | n | Repetitions or starts | Type | True mean | Bias | SD | RMSE |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Methods at n = 100 | Baseline | Simple random | Without replacement | 2026 | 100 | 1,000 | Monte Carlo | $13,270.42 | $16.70 | $1,171.27 | $1,171.39 |
| Methods at n = 100 | Baseline | Systematic | Fractional interval 13.3800; original file order | 2026 | 100 | 1,000 | Monte Carlo | $13,270.42 | $16.02 | $955.21 | $955.34 |
| Methods at n = 100 | Baseline | Stratified | Region; proportional allocation | 2026 | 100 | 1,000 | Monte Carlo | $13,270.42 | -$10.13 | $1,111.19 | $1,111.24 |
| Sample size | Baseline | Simple random | Without replacement | 2026 | 1 | 1,000 | Monte Carlo | $13,270.42 | $305.14 | $12,268.04 | $12,271.83 |
| Sample size | Baseline | Simple random | Without replacement | 2026 | 10 | 1,000 | Monte Carlo | $13,270.42 | -$28.31 | $3,836.57 | $3,836.68 |
| Challenge | Baseline | Systematic | Fractional interval 13.3800; original file order | 2026 | 100 | 1,000 | Monte Carlo | $13,270.42 | $16.02 | $955.21 | $955.34 |
| Challenge | Modified: sorted charges ascending | Systematic | Fractional interval 13.3800; charges ascending | 2026 | 100 | 1,000 | Monte Carlo | $13,270.42 | $2.92 | $190.70 | $190.72 |
| Challenge | Baseline | Simple random | Without replacement; original file order | 2026 | 100 | 1,000 | Monte Carlo | $13,270.42 | $16.70 | $1,171.27 | $1,171.39 |
| Challenge | Modified: sorted charges ascending | Simple random | Without replacement; charges ascending | 2026 | 100 | 1,000 | Monte Carlo | $13,270.42 | -$5.23 | $1,172.43 | $1,172.44 |

The simple random sampling result at n = 100 also serves as the n = 100 sample-size result because the population and experimental settings match.

The challenge baseline rows repeat the corresponding Stage 4 results because the methods, population, sample size, seed, and repetitions are the same. The modified rows represent separate experiments using the sorted copy of the dataset.

## 4. Findings (in my own words, using my own numbers)

**(a) Method comparison: the three sampling methods compared at n = 100 (bias versus variability, and for which population):**

When comparing the three sampling methods using the original Healthcare Costs population, systematic sampling produced the lowest RMSE at $955.34, followed by stratified sampling at $1,111.24 and simple random sampling at $1,171.39.

What stood out to me was that the bias was relatively small for all three methods, ranging from -$10.13 to $16.70. The larger difference was in the standard deviation, which suggests that variability between repeated sample estimates was more important than the observed bias in this experiment.

Based on these results, systematic sampling performed best for this particular population and set of experimental conditions. However, I would not assume it will always be the best approach, especially if the records are organized differently.

**(b) Sample-size finding: how sample size affects the spread of estimates and the estimation error, and what a larger sample cannot fix:**

The sample-size experiment showed a clear improvement in estimation precision as the sample size increased. With a sample size of 1, the RMSE was $12,271.83. This decreased to $3,836.68 with 10 records and $1,171.39 with 100 records.

The standard deviation followed a similar pattern, decreasing from $12,268.04 at n = 1 to $1,171.27 at n = 100.

To me, this demonstrates why relying on a very small number of observations can produce inconsistent estimates, particularly when medical charges vary considerably between beneficiaries.

Larger samples generally reduce sampling variability, but they do not automatically correct problems with how records are selected. If a sampling method consistently favors certain observations or excludes part of the population, increasing the sample size may not eliminate that problem.

## 5. Challenge (hypothesis)

**Hypothesis:**

- **Date written:** November 8, 2026.

- **Method I chose to challenge:** Systematic sampling.

- **The change to the population or its ordering:** For this experiment, I will sort the Healthcare Costs dataset by medical charges, from lowest to highest. The actual data will remain unchanged, but the order of the records will be different.

- **Why the selection rule would interact with that change:** Systematic sampling selects records at regular intervals rather than randomly selecting each individual record. My thinking is that changing how the data is organized could influence which records are selected and ultimately affect how accurately the sample represents the overall population.

- **Evidence I expect across repeated samples:** I expect systematic sampling to perform differently once the data is sorted, potentially resulting in greater variability and a higher RMSE compared to the original dataset. However, I also recognize that sorting the records could help distribute the selected observations more evenly across the range of medical charges.

- **Alternative method or correction I will compare, and why:** I will compare the results against simple random sampling. Since this method does not depend on selecting records at fixed intervals, I would expect it to be less affected by how the dataset is organized.

- **Evidence that would contradict my hypothesis:** If systematic sampling produces a similar or lower RMSE after sorting the records, that would suggest the change in ordering did not negatively affect the estimates as I initially expected.

### After I test it

- **Test settings (conditions, methods, alternative method or correction, n, seeds); results are in the table above:**

  I compared the original Healthcare Costs dataset against a modified copy sorted by medical charges in ascending order. I evaluated systematic sampling and simple random sampling using n = 100, 1,000 repetitions, and seed 2026.

  Each method was tested against both population conditions separately, resulting in four challenge comparisons. The underlying population remained unchanged, with 1,338 records and a true mean of $13,270.42.

**(c) Challenge interpretation: did the evidence support my hypothesis? Bias versus variability, other explanations, what the alternative or correction showed, and any dated revision (keep the original above):**

The results did not support my original hypothesis. I expected that sorting the dataset by medical charges would increase the estimation error associated with systematic sampling. Instead, the RMSE decreased considerably, from $955.34 using the original dataset to $190.72 after sorting the records.

What stood out to me was that the improvement was primarily related to variability rather than bias. The standard deviation decreased from $955.21 to $190.70, while the bias also decreased from $16.02 to $2.92. This suggests that sorting the data helped systematic sampling produce more consistent estimates across repeated samples.

Simple random sampling produced a different outcome. Its RMSE remained relatively unchanged, increasing slightly from $1,171.39 to $1,172.44. This makes sense because simple random sampling does not depend on the order of the records in the same way systematic sampling does.

Looking at the results, I think sorting the medical charges helped distribute the systematic samples more evenly across the population, rather than creating the sampling problem I initially expected. However, I would not assume that sorting always improves systematic sampling, since the outcome could depend on the dataset and how the sampling intervals interact with the ordering.

Overall, this experiment helped me better understand that the organization of a dataset can influence the performance of certain sampling methods. Although my original prediction was incorrect, the results provided a useful example of why it is important to test sampling assumptions rather than assume a particular method will perform consistently under different conditions.

## 6. AI use

- **Tools used:** ChatGPT.

- **What I asked my agent to do, and what I checked myself:** I used ChatGPT to support the technical development of the application, understand the assignment requirements, troubleshoot setup issues, organize documentation, and review the statistical outputs for consistency. I independently operated the application, selected the experiment settings, and recorded the results generated by the program.

- **Automated checks my agent reported (I did not let it interpret my results):** The application development included checks of sampling sizes, unique record selection, proportional allocation totals, random-seed reproducibility, and RMSE calculation consistency. The Healthcare Costs CSV was also verified to contain 1,338 records. Final application build and challenge-functionality checks should be recorded here after they have been completed.